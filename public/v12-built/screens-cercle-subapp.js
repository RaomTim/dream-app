const { useState: uSAS, useEffect: uSAE, useMemo: uSAM, useRef: uSAR, useCallback: uSAC } = React;
function _relWhen(iso) {
  var _a, _b;
  if (!iso) return "r\xE9cemment";
  try {
    return ((_b = (_a = window.DreamAPI) == null ? void 0 : _a._relativeWhen) == null ? void 0 : _b.call(_a, iso)) || "r\xE9cemment";
  } catch (e) {
    return "r\xE9cemment";
  }
}
function _glyph(idx) {
  const g = ["\u03B1", "\u03B2", "\u03B3", "\u03B4", "\u03B5", "\u03B6", "\u03B7", "\u03B8", "\u03B9", "\u03BA", "\u03BB", "\u03BC"];
  return g[idx % g.length];
}
async function _authedFetch(url, opts = {}) {
  var _a, _b;
  let headers = { ...opts.headers || {} };
  try {
    const sess = (_b = (_a = window.DreamAuth) == null ? void 0 : _a.getSession) == null ? void 0 : _b.call(_a);
    const token = sess == null ? void 0 : sess.access_token;
    if (token) headers["Authorization"] = "Bearer " + token;
  } catch (e) {
  }
  if (opts.body && !headers["Content-Type"]) headers["Content-Type"] = "application/json";
  return fetch(url, { ...opts, headers });
}
const TabMembres = ({ circle, members, circleId }) => {
  const count = (members == null ? void 0 : members.length) || (circle == null ? void 0 : circle.member_count) || 1;
  const [inviteData, setInviteData] = uSAS(null);
  const [creating, setCreating] = uSAS(false);
  const [error, setError] = uSAS(null);
  const [copied, setCopied] = uSAS(false);
  const generateInvite = async () => {
    setCreating(true);
    setError(null);
    try {
      const r = await _authedFetch(`/api/circles/${encodeURIComponent(circleId)}/invitations`, {
        method: "POST",
        body: JSON.stringify({ uses_remaining: 12, expires_in_days: 14 })
      });
      const data = await r.json();
      if (!r.ok) {
        setError((data == null ? void 0 : data.error) || "g\xE9n\xE9ration impossible");
      } else {
        setInviteData(data);
      }
    } catch (e) {
      setError((e == null ? void 0 : e.message) || "g\xE9n\xE9ration impossible");
    } finally {
      setCreating(false);
    }
  };
  const doCopy = async () => {
    var _a;
    if (!(inviteData == null ? void 0 : inviteData.share_url)) return;
    try {
      await ((_a = navigator.clipboard) == null ? void 0 : _a.writeText(inviteData.share_url));
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (e) {
    }
  };
  const doShare = async () => {
    if (!(inviteData == null ? void 0 : inviteData.share_url)) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: ((circle == null ? void 0 : circle.name) || "cercle") + " \xB7 Dream",
          text: "tu es invit\xE9\xB7e \xE0 tenir ce cercle dans Dream",
          url: inviteData.share_url
        });
      } catch (e) {
      }
    } else {
      doCopy();
    }
  };
  const openPreview = () => {
    if (inviteData == null ? void 0 : inviteData.share_url) window.open(inviteData.share_url, "_blank", "noopener");
  };
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "meta op-70 mb-l",
      style: { fontFamily: "var(--serif)", fontStyle: "italic", maxWidth: 560 }
    },
    count,
    " ",
    count > 1 ? "personnes tiennent" : "personne tient",
    " ce cercle. les pseudos sont g\xE9n\xE9riques \u2014 l'identit\xE9 est port\xE9e par la voix, pas par le nom."
  ), /* @__PURE__ */ React.createElement("div", { className: "row mb-xl", style: { gap: 10, flexWrap: "wrap" } }, Array.from({ length: Math.min(count, 12) }, (_, i) => /* @__PURE__ */ React.createElement(
    "div",
    {
      key: i,
      style: {
        width: 40,
        height: 40,
        borderRadius: "50%",
        border: "1px solid var(--ash-deep)",
        display: "grid",
        placeItems: "center",
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        fontSize: 15,
        color: "var(--ash-light)",
        background: "color-mix(in oklch, var(--stone-cool) 4%, transparent)"
      }
    },
    _glyph(i)
  )), count > 12 && /* @__PURE__ */ React.createElement("div", { style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    color: "var(--ash-light)",
    fontSize: 14,
    alignSelf: "center"
  } }, "+", count - 12)), !inviteData && /* @__PURE__ */ React.createElement("div", { className: "mt-l" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "btn-ghost",
      onClick: generateInvite,
      disabled: creating || !!(circle == null ? void 0 : circle.closed_at)
    },
    creating ? "\u2026" : "\u2726 inviter"
  ), error && /* @__PURE__ */ React.createElement("div", { className: "meta mt-s", style: {
    color: "var(--ember-live)",
    fontFamily: "var(--serif)",
    fontStyle: "italic"
  } }, error)), inviteData && /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "card mt-l",
      style: {
        padding: "var(--s-4)",
        background: "color-mix(in oklch, var(--silk-gold) 4%, var(--night-floor))",
        border: "1px solid color-mix(in oklch, var(--silk-gold) 22%, var(--ash-deep))",
        borderRadius: 0
      }
    },
    /* @__PURE__ */ React.createElement("div", { className: "meta-mono mb-s", style: {
      fontFamily: "var(--mono)",
      fontSize: 10,
      letterSpacing: "0.14em",
      color: "var(--silk-gold)",
      textTransform: "uppercase"
    } }, "\u2726 lien d'invitation pr\xEAt"),
    /* @__PURE__ */ React.createElement(
      "p",
      {
        className: "seuil-italic mb-m",
        style: {
          color: "var(--bone)",
          fontSize: 14,
          lineHeight: 1.6,
          fontFamily: "var(--serif)",
          fontStyle: "italic",
          maxWidth: 480
        }
      },
      "partage ce lien \xE0 qui tu veux inviter. il r\xE9v\xE8le l'intention du cercle \u2014 jamais les noms des membres. ",
      inviteData.uses_remaining,
      " utilisations restantes \xB7 expire ",
      _relWhen(inviteData.expires_at),
      "."
    ),
    /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "card mb-m",
        style: {
          padding: "var(--s-3) var(--s-4)",
          background: "var(--night-floor)",
          border: "1px solid var(--ash-deep)",
          fontFamily: "var(--mono)",
          fontSize: 12,
          color: "var(--ash-light)",
          wordBreak: "break-all",
          userSelect: "all"
        }
      },
      inviteData.share_url
    ),
    /* @__PURE__ */ React.createElement("div", { className: "row gap-s", style: { flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("button", { className: "btn-ghost", onClick: doCopy }, copied ? "\u2713 copi\xE9" : "copier le lien"), typeof navigator !== "undefined" && navigator.share && /* @__PURE__ */ React.createElement("button", { className: "btn-text", onClick: doShare }, "partager\u2026"), /* @__PURE__ */ React.createElement("button", { className: "btn-text", onClick: openPreview, style: { color: "var(--ash-light)" } }, "voir le preview"), /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "btn-text",
        onClick: () => {
          setInviteData(null);
          setCopied(false);
        },
        style: { color: "var(--ash-light)" }
      },
      "g\xE9n\xE9rer un autre"
    ))
  ));
};
const TabDepots = ({ circle, circleId, go }) => {
  if (window.CercleDetail) {
    return /* @__PURE__ */ React.createElement("div", { className: "dream-cercle-legacy-host" }, /* @__PURE__ */ React.createElement(window.CercleDetail, { go, circleId }));
  }
  return /* @__PURE__ */ React.createElement("div", { className: "meta op-70", style: { fontFamily: "var(--serif)", fontStyle: "italic" } }, "les d\xE9p\xF4ts s'afficheront ici une fois le module legacy charg\xE9.");
};
const TabChat = ({ circleId }) => {
  const [messages, setMessages] = uSAS([]);
  const [loading, setLoading] = uSAS(true);
  const [input, setInput] = uSAS("");
  const [sending, setSending] = uSAS(false);
  const [streaming, setStreaming] = uSAS("");
  const [error, setError] = uSAS(null);
  const scrollRef = uSAR(null);
  const fetchMessages = uSAC(async () => {
    try {
      const r = await _authedFetch(`/api/circles/${circleId}/chat/converse`);
      const data = await r.json();
      if (data == null ? void 0 : data.messages) setMessages(data.messages);
      setLoading(false);
    } catch (e) {
      console.warn("[TabChat] fetch failed:", e == null ? void 0 : e.message);
      setLoading(false);
    }
  }, [circleId]);
  uSAE(() => {
    fetchMessages();
  }, [fetchMessages]);
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
    const optimistic = {
      id: "tmp-" + Date.now(),
      user_id: "me",
      is_ai_gardienne: false,
      content: text,
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      is_voice: !!voiceMeta,
      voice_duration_ms: (voiceMeta == null ? void 0 : voiceMeta.duration_ms) || null
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
        body: JSON.stringify(payload)
      });
      const ct = r.headers.get("Content-Type") || "";
      if (!ct.includes("text/event-stream")) {
        const data = await r.json().catch(() => ({}));
        if (data == null ? void 0 : data.error) setError(data.error);
        await fetchMessages();
        setSending(false);
        return;
      }
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
          } catch (e) {
          }
        }
      }
      await fetchMessages();
      setStreaming("");
    } catch (e) {
      setError((e == null ? void 0 : e.message) || "envoi non abouti");
    } finally {
      setSending(false);
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: "stack gap-m" }, /* @__PURE__ */ React.createElement(
    "p",
    {
      className: "meta op-70 mb-s",
      style: { fontFamily: "var(--serif)", fontStyle: "italic", maxWidth: 560 }
    },
    "ici on \xE9crit ensemble. l'IA gardienne reste silencieuse \u2014 appelle-la avec @Anima ou /for\xEAt /synth\xE8se /intention."
  ), /* @__PURE__ */ React.createElement(
    "div",
    {
      ref: scrollRef,
      className: "card",
      style: {
        padding: "var(--s-3) var(--s-4)",
        background: "color-mix(in oklch, var(--night-warm) 70%, var(--night-floor))",
        border: "1px solid var(--ash-deep)",
        borderRadius: 0,
        maxHeight: 480,
        overflowY: "auto"
      }
    },
    loading ? /* @__PURE__ */ React.createElement("div", { className: "meta op-70", style: { fontFamily: "var(--serif)", fontStyle: "italic" } }, "chargement\u2026") : messages.length === 0 && !streaming ? /* @__PURE__ */ React.createElement("div", { className: "meta op-70", style: { fontFamily: "var(--serif)", fontStyle: "italic" } }, "le cercle est silencieux. d\xE9pose le premier mot.") : /* @__PURE__ */ React.createElement("div", { className: "stack gap-s" }, messages.map((m) => /* @__PURE__ */ React.createElement(ChatMessageRow, { key: m.id, msg: m })), streaming && /* @__PURE__ */ React.createElement(
      ChatMessageRow,
      {
        msg: {
          id: "streaming",
          is_ai_gardienne: true,
          content: streaming,
          voice_attribution: "gardienne",
          created_at: (/* @__PURE__ */ new Date()).toISOString()
        },
        streaming: true
      }
    ))
  ), error && /* @__PURE__ */ React.createElement("div", { className: "meta", style: {
    color: "var(--ember-live)",
    fontFamily: "var(--serif)",
    fontStyle: "italic"
  } }, error), /* @__PURE__ */ React.createElement("div", { className: "row gap-s", style: { alignItems: "flex-end" } }, /* @__PURE__ */ React.createElement(
    "textarea",
    {
      className: "field-textarea",
      placeholder: "d\xE9poser un mot dans le cercle\u2026",
      value: input,
      onChange: (e) => setInput(e.target.value),
      rows: 2,
      style: { flex: 1 },
      disabled: sending,
      onKeyDown: (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          send();
        }
      }
    }
  ), window.ChatVoiceMicButton && /* @__PURE__ */ React.createElement(
    window.ChatVoiceMicButton,
    {
      disabled: sending,
      onTranscribed: ({ transcript, duration_ms, lang }) => {
        if (transcript) send(transcript, { duration_ms, lang });
      }
    }
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "btn-ghost",
      disabled: sending || !input.trim(),
      onClick: () => send(),
      style: { minWidth: 100 }
    },
    sending ? "\u2026" : "d\xE9poser"
  )), /* @__PURE__ */ React.createElement("div", { className: "meta op-50", style: {
    fontFamily: "var(--mono)",
    fontSize: 10,
    letterSpacing: "0.1em"
  } }, "@Anima \xB7 /for\xEAt \xB7 /synth\xE8se \xB7 /intention"));
};
const ChatMessageRow = ({ msg, streaming }) => {
  const ai = msg.is_ai_gardienne;
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "card",
      style: {
        padding: "var(--s-3) var(--s-4)",
        background: ai ? "color-mix(in oklch, var(--silk-gold) 5%, var(--night-floor))" : "transparent",
        border: ai ? "1px solid color-mix(in oklch, var(--silk-gold) 25%, var(--ash-deep))" : "1px solid var(--ash-deep)",
        borderRadius: 0,
        opacity: streaming ? 0.85 : 1
      }
    },
    /* @__PURE__ */ React.createElement("div", { className: "meta-mono mb-s", style: {
      fontFamily: "var(--mono)",
      fontSize: 10,
      letterSpacing: "0.12em",
      color: ai ? "var(--silk-gold)" : "var(--ash-light)",
      textTransform: "uppercase"
    } }, ai ? msg.voice_attribution || "gardienne" : "voix du cercle", " \xB7 ", _relWhen(msg.created_at), msg.triggered_by_keyword && /* @__PURE__ */ React.createElement("span", { style: { marginLeft: 8, opacity: 0.7 } }, "\xB7 ", msg.triggered_by_keyword), msg.is_voice && /* @__PURE__ */ React.createElement("span", { style: { marginLeft: 8, color: "var(--silk-gold)" } }, "\xB7 \u{1F399}", msg.voice_duration_ms ? " " + Math.round(msg.voice_duration_ms / 1e3) + "s" : "")),
    /* @__PURE__ */ React.createElement("div", { style: {
      fontFamily: "var(--serif)",
      fontStyle: ai ? "italic" : "normal",
      fontSize: 15,
      lineHeight: 1.6,
      color: "var(--bone)",
      textWrap: "pretty",
      whiteSpace: "pre-wrap"
    } }, msg.content, streaming && /* @__PURE__ */ React.createElement("span", { style: { opacity: 0.5 } }, "\u258D"))
  );
};
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
        body: JSON.stringify({ force })
      });
      const data = await r.json();
      if (data == null ? void 0 : data.error) {
        setError(data.error);
      } else if (data == null ? void 0 : data.k_anonymity_failed) {
        setLettre(null);
        setInfo(data.message || "pas encore assez de voix.");
      } else if (data == null ? void 0 : data.empty) {
        setLettre(null);
        setInfo(data.message || "rien \xE0 tisser pour le moment.");
      } else if (data == null ? void 0 : data.lettre) {
        setLettre(data.lettre);
        setInfo(data.cached ? `version g\xE9n\xE9r\xE9e ${_relWhen(data.generated_at)} \u2014 cache mensuel` : "version fra\xEEche");
      } else {
        setError("r\xE9ponse inattendue");
      }
    } catch (e) {
      setError((e == null ? void 0 : e.message) || "g\xE9n\xE9ration non aboutie");
    } finally {
      setLoading(false);
    }
  };
  uSAE(() => {
    generate(false);
  }, [circleId]);
  return /* @__PURE__ */ React.createElement("div", { className: "stack gap-m" }, /* @__PURE__ */ React.createElement(
    "p",
    {
      className: "meta op-70",
      style: { fontFamily: "var(--serif)", fontStyle: "italic", maxWidth: 560 }
    },
    "une lettre tiss\xE9e chaque mois \xE0 partir des motifs collectifs d\xE9pos\xE9s dans le cercle. anonyme par construction. au moins 5 voix doivent avoir contribu\xE9."
  ), loading && /* @__PURE__ */ React.createElement("div", { className: "text-center", style: { padding: "var(--s-5)" } }, /* @__PURE__ */ React.createElement("div", { className: "breath", style: { margin: "0 auto" } }), /* @__PURE__ */ React.createElement("p", { className: "seuil-italic mt-m", style: { color: "var(--ash-light)" } }, "la lettre se forme.")), !loading && lettre && /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "card",
      style: {
        padding: "var(--s-5) var(--s-4)",
        background: "var(--night-warm)",
        border: "1px solid color-mix(in oklch, var(--silk-gold) 14%, var(--ash-deep))",
        borderRadius: 0
      }
    },
    info && /* @__PURE__ */ React.createElement("div", { className: "meta-mono mb-m", style: {
      fontFamily: "var(--mono)",
      fontSize: 10,
      letterSpacing: "0.14em",
      color: "var(--silk-gold)",
      textTransform: "uppercase"
    } }, info),
    /* @__PURE__ */ React.createElement("div", { style: {
      fontFamily: "var(--serif)",
      fontStyle: "italic",
      fontSize: 17,
      lineHeight: 1.7,
      color: "var(--bone)",
      textWrap: "pretty",
      whiteSpace: "pre-wrap"
    } }, lettre)
  ), !loading && !lettre && info && /* @__PURE__ */ React.createElement("div", { className: "card", style: {
    padding: "var(--s-4)",
    background: "transparent",
    border: "1px solid var(--ash-deep)",
    borderRadius: 0
  } }, /* @__PURE__ */ React.createElement("p", { className: "seuil-italic", style: { color: "var(--ash-light)", maxWidth: 480 } }, info)), error && /* @__PURE__ */ React.createElement("div", { className: "meta", style: {
    color: "var(--ember-live)",
    fontFamily: "var(--serif)",
    fontStyle: "italic"
  } }, error), /* @__PURE__ */ React.createElement("div", { className: "row gap-m mt-s", style: { flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("button", { className: "btn-ghost", disabled: loading, onClick: () => generate(true) }, loading ? "g\xE9n\xE9ration\u2026" : "r\xE9g\xE9n\xE9rer")));
};
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
      const filtered = ((data == null ? void 0 : data.intentions) || []).filter((i) => i.intention_text !== "__portrait_mensuel__");
      setIntentions(filtered);
    } catch (e) {
      console.warn("[TabIntentions] fetch failed:", e == null ? void 0 : e.message);
    } finally {
      setLoading(false);
    }
  }, [circleId]);
  uSAE(() => {
    fetchAll();
  }, [fetchAll]);
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
          active_until: draftUntil || null
        })
      });
      const data = await r.json();
      if (data == null ? void 0 : data.error) setError(data.error);
      else {
        setDraftText("");
        setDraftUntil("");
        setProposeOpen(false);
        await fetchAll();
      }
    } catch (e) {
      setError((e == null ? void 0 : e.message) || "proposition non aboutie");
    } finally {
      setBusy(false);
    }
  };
  const vote = async (intentionId) => {
    setBusy(true);
    try {
      await _authedFetch(`/api/circles/${circleId}/intentions/${intentionId}/vote`, {
        method: "POST",
        body: JSON.stringify({})
      });
      await fetchAll();
    } catch (e) {
      console.warn("[TabIntentions] vote failed:", e == null ? void 0 : e.message);
    } finally {
      setBusy(false);
    }
  };
  const archive = async (intentionId) => {
    if (!confirm("archiver cette intention ?")) return;
    setBusy(true);
    try {
      await _authedFetch(`/api/circles/${circleId}/intentions/${intentionId}`, {
        method: "DELETE"
      });
      await fetchAll();
    } catch (e) {
      console.warn("[TabIntentions] archive failed:", e == null ? void 0 : e.message);
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: "stack gap-m" }, /* @__PURE__ */ React.createElement(
    "p",
    {
      className: "meta op-70",
      style: { fontFamily: "var(--serif)", fontStyle: "italic", maxWidth: 560 }
    },
    "une intention n'est pas un objectif. c'est une orientation que le cercle tient ensemble. propose, vote, laisse vivre."
  ), loading ? /* @__PURE__ */ React.createElement("div", { className: "meta op-70", style: { fontFamily: "var(--serif)", fontStyle: "italic" } }, "chargement\u2026") : intentions.length === 0 ? /* @__PURE__ */ React.createElement("p", { className: "seuil-italic", style: { color: "var(--ash-light)" } }, "aucune intention active. propose la premi\xE8re.") : /* @__PURE__ */ React.createElement("div", { className: "stack gap-s" }, intentions.map((it) => /* @__PURE__ */ React.createElement(
    IntentionRow,
    {
      key: it.id,
      intention: it,
      onVote: () => vote(it.id),
      onArchive: () => archive(it.id),
      busy
    }
  ))), error && /* @__PURE__ */ React.createElement("div", { className: "meta", style: {
    color: "var(--ember-live)",
    fontFamily: "var(--serif)",
    fontStyle: "italic"
  } }, error), !proposeOpen ? /* @__PURE__ */ React.createElement("button", { className: "btn-ghost mt-m", onClick: () => setProposeOpen(true) }, "+ proposer une intention") : /* @__PURE__ */ React.createElement("div", { className: "card mt-m", style: {
    padding: "var(--s-4)",
    background: "color-mix(in oklch, var(--stone-cool) 5%, var(--night-floor))",
    border: "1px solid color-mix(in oklch, var(--silk-gold) 18%, var(--ash-deep))",
    borderRadius: 0
  } }, /* @__PURE__ */ React.createElement(
    "textarea",
    {
      className: "field-textarea mb-m",
      placeholder: "traverser cette saison sans se pr\xE9cipiter. tenir nos d\xE9saccords sans rompre. \xE9couter ce qui revient dans nos r\xEAves\u2026",
      value: draftText,
      onChange: (e) => setDraftText(e.target.value),
      rows: 3,
      autoFocus: true
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "row gap-s mb-m", style: { alignItems: "center" } }, /* @__PURE__ */ React.createElement("label", { className: "meta op-70", style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 13
  } }, "active jusqu'au (optionnel) :"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "date",
      className: "field-input",
      value: draftUntil,
      onChange: (e) => setDraftUntil(e.target.value),
      style: { maxWidth: 200 }
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "row gap-m", style: { justifyContent: "flex-end" } }, /* @__PURE__ */ React.createElement("button", { className: "btn-text", onClick: () => setProposeOpen(false), disabled: busy }, "annuler"), /* @__PURE__ */ React.createElement("button", { className: "btn-ghost", onClick: propose, disabled: busy || !draftText.trim() }, busy ? "\u2026" : "proposer"))));
};
const IntentionRow = ({ intention, onVote, onArchive, busy }) => {
  const until = intention.active_until ? new Date(intention.active_until).toLocaleDateString("fr-FR") : null;
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "card",
      style: {
        padding: "var(--s-3) var(--s-4)",
        background: "transparent",
        border: "1px solid var(--ash-deep)",
        borderRadius: 0
      }
    },
    /* @__PURE__ */ React.createElement("div", { style: {
      fontFamily: "var(--serif)",
      fontStyle: "italic",
      fontSize: 16,
      lineHeight: 1.55,
      color: "var(--bone)",
      textWrap: "pretty"
    } }, "\xAB ", intention.intention_text, " \xBB"),
    /* @__PURE__ */ React.createElement("div", { className: "row mt-s", style: {
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 8
    } }, /* @__PURE__ */ React.createElement("div", { className: "meta-mono", style: {
      fontFamily: "var(--mono)",
      fontSize: 10,
      letterSpacing: "0.12em",
      color: "var(--ash-light)",
      textTransform: "uppercase"
    } }, _relWhen(intention.created_at), until && /* @__PURE__ */ React.createElement("span", null, " \xB7 jusqu'au ", until), " \xB7 ", /* @__PURE__ */ React.createElement("span", { style: { color: "var(--silk-gold)" } }, intention.votes_count || 0, " ", intention.votes_count === 1 ? "voix" : "voix")), /* @__PURE__ */ React.createElement("div", { className: "row gap-s" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "btn-text",
        disabled: busy,
        onClick: onVote,
        style: { fontSize: 12.5 }
      },
      "tenir cette intention"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "btn-text",
        disabled: busy,
        onClick: onArchive,
        style: { fontSize: 12.5, color: "var(--ash-light)" }
      },
      "archiver"
    )))
  );
};
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
          setError((data == null ? void 0 : data.error) || "lecture finale introuvable");
        } else {
          const list = (data == null ? void 0 : data.restitutions) || [];
          const closure = list.find((x) => x.is_closure_restitution || x.id === (circle == null ? void 0 : circle.closure_restitution_id));
          setRestitution(closure || list[0] || null);
        }
      } catch (e) {
        if (!cancelled) setError((e == null ? void 0 : e.message) || "lecture finale introuvable");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [circleId, circle == null ? void 0 : circle.closure_restitution_id]);
  const archiveToMemories = async () => {
    var _a;
    if (!(restitution == null ? void 0 : restitution.narrative_text)) return;
    try {
      await ((_a = navigator.clipboard) == null ? void 0 : _a.writeText(restitution.narrative_text));
      alert("la lecture finale est dans ton presse-papier \u2014 colle-la o\xF9 tu gardes tes m\xE9moires.");
    } catch (e) {
      alert("copie manuelle n\xE9cessaire \u2014 s\xE9lectionne le texte ci-dessus.");
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: "stack gap-m" }, /* @__PURE__ */ React.createElement(
    "p",
    {
      className: "meta op-70",
      style: { fontFamily: "var(--serif)", fontStyle: "italic", maxWidth: 560 }
    },
    "ce cercle s'est referm\xE9. trois voix tress\xE9es \u2014 paper, stone, silk \u2014 sont venues poser ce qui a travers\xE9 pendant cette travers\xE9e. la trame reste, anonyme et nue, dans tes m\xE9moires si tu veux."
  ), loading && /* @__PURE__ */ React.createElement("div", { className: "text-center", style: { padding: "var(--s-5)" } }, /* @__PURE__ */ React.createElement("div", { className: "breath", style: { margin: "0 auto" } }), /* @__PURE__ */ React.createElement("p", { className: "seuil-italic mt-m", style: { color: "var(--ash-light)" } }, "la lecture finale se charge.")), !loading && error && /* @__PURE__ */ React.createElement("div", { className: "meta", style: {
    color: "var(--ember-live)",
    fontFamily: "var(--serif)",
    fontStyle: "italic"
  } }, error), !loading && restitution && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "card",
      style: {
        padding: "var(--s-5) var(--s-4)",
        background: "var(--night-warm)",
        border: "1px solid color-mix(in oklch, var(--silk-gold) 14%, var(--ash-deep))",
        borderRadius: 0
      }
    },
    /* @__PURE__ */ React.createElement("div", { className: "meta-mono mb-m", style: {
      fontFamily: "var(--mono)",
      fontSize: 10,
      letterSpacing: "0.14em",
      color: "var(--silk-gold)",
      textTransform: "uppercase"
    } }, "\u2726 lecture finale \xB7 ", _relWhen(restitution.requested_at || restitution.generated_at || (circle == null ? void 0 : circle.closed_at))),
    /* @__PURE__ */ React.createElement("div", { style: {
      fontFamily: "var(--serif)",
      fontStyle: "italic",
      fontSize: 17,
      lineHeight: 1.75,
      color: "var(--bone)",
      textWrap: "pretty",
      whiteSpace: "pre-wrap"
    } }, restitution.narrative_text || "(la lecture finale n'a pas pu \xEAtre tiss\xE9e.)")
  ), /* @__PURE__ */ React.createElement("div", { className: "row gap-m mt-s", style: { flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("button", { className: "btn-ghost", onClick: archiveToMemories }, "archiver dans mes m\xE9moires"))), !loading && !restitution && !error && /* @__PURE__ */ React.createElement("p", { className: "seuil-italic", style: { color: "var(--ash-light)" } }, "aucune lecture finale n'a encore \xE9t\xE9 tiss\xE9e pour ce cercle."));
};
const CercleSubApp = ({ go, circleId }) => {
  const [tab, setTab] = uSAS(() => {
    try {
      const m = (location.hash || "").match(/[?&]tab=([a-z-]+)/);
      return m ? m[1] : "depots";
    } catch (e) {
      return "depots";
    }
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
    window.DreamAPI.listCircles().then((d) => {
      if (cancelled) return;
      const found = ((d == null ? void 0 : d.circles) || []).find((c) => c.id === circleId);
      setCircle(found || null);
      setLoading(false);
    }).catch(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [circleId]);
  if (loading) {
    return /* @__PURE__ */ React.createElement("div", { className: "stage", style: { background: "var(--night-floor)" } }, /* @__PURE__ */ React.createElement(window.TopNav, { showBack: true, onBack: () => go("cercle"), label: "" }), /* @__PURE__ */ React.createElement("div", { className: "frame center", style: { minHeight: "calc(100vh - 60px)" } }, /* @__PURE__ */ React.createElement("div", { className: "breath" })));
  }
  if (!circle) {
    return /* @__PURE__ */ React.createElement("div", { className: "stage screen-enter", style: { background: "var(--night-floor)" } }, /* @__PURE__ */ React.createElement(window.TopNav, { showBack: true, onBack: () => go("cercle"), label: "" }), /* @__PURE__ */ React.createElement("div", { className: "frame center", style: { paddingTop: "var(--s-6)" } }, /* @__PURE__ */ React.createElement("p", { className: "seuil-italic", style: { color: "var(--ash-light)" } }, "ce cercle ne te tient plus, ou n'existe pas."), /* @__PURE__ */ React.createElement("button", { className: "btn-text mt-l", onClick: () => go("cercle") }, "\u2190 retour \xE0 tes cercles")));
  }
  const isEphemeral = !!(circle == null ? void 0 : circle.ephemeral_until);
  const isClosed = !!(circle == null ? void 0 : circle.closed_at);
  const ephemeralCountdown = uSAM(() => {
    if (!isEphemeral || isClosed) return null;
    const ms = new Date(circle.ephemeral_until).getTime() - Date.now();
    if (ms <= 0) return { days: 0, hours: 0, label: "ce cercle se referme aujourd'hui" };
    const days = Math.floor(ms / (24 * 3600 * 1e3));
    const hours = Math.floor(ms % (24 * 3600 * 1e3) / (3600 * 1e3));
    let label;
    if (days >= 2) label = `ce cercle se referme dans ${days} jours`;
    else if (days === 1) label = "ce cercle se referme demain";
    else label = `ce cercle se referme dans ${hours} heures`;
    return { days, hours, label };
  }, [isEphemeral, isClosed, circle == null ? void 0 : circle.ephemeral_until]);
  const TABS = [
    ...isClosed ? [["closure", "\u2726 rituel de cl\xF4ture"]] : [],
    ["depots", "d\xE9p\xF4ts"],
    ["chat", "chat"],
    ["synchronicites", "synchronicit\xE9s"],
    ["meteo", "m\xE9t\xE9o"],
    ["annales", "annales"],
    ["rituels", "rituels"],
    ["intentions", "intentions"],
    ["portrait", "portrait"],
    ["membres", "membres"]
  ];
  return /* @__PURE__ */ React.createElement("div", { className: "stage screen-enter", style: { background: "var(--night-floor)" } }, /* @__PURE__ */ React.createElement(window.TopNav, { showBack: true, onBack: () => go("cercle"), label: "" }), /* @__PURE__ */ React.createElement("div", { className: "frame", style: { position: "relative" } }, /* @__PURE__ */ React.createElement("div", { className: "meta-mono mb-s", style: {
    fontFamily: "var(--mono)",
    fontSize: 10,
    letterSpacing: "0.14em",
    color: "var(--silk-gold)",
    textTransform: "uppercase"
  } }, "cercle \xB7 ", circle.type || "spontane"), /* @__PURE__ */ React.createElement("h1", { className: "h1-seuil mb-l" }, circle.name), ephemeralCountdown && !isClosed && /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "card mb-l",
      style: {
        padding: "var(--s-2) var(--s-3)",
        border: "1px solid color-mix(in oklch, var(--silk-gold) 22%, var(--ash-deep))",
        background: "color-mix(in oklch, var(--silk-gold) 4%, transparent)",
        borderRadius: 0
      }
    },
    /* @__PURE__ */ React.createElement(
      "div",
      {
        style: {
          fontFamily: "var(--serif)",
          fontStyle: "italic",
          fontSize: 14,
          lineHeight: 1.6,
          color: "var(--silk-gold)"
        }
      },
      "\u2726 ",
      ephemeralCountdown.label,
      ".",
      /* @__PURE__ */ React.createElement("span", { style: { color: "var(--ash-light)", marginLeft: 8 } }, "au jour J, une lecture finale sera tiss\xE9e.")
    )
  ), isClosed && /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "card mb-l",
      style: {
        padding: "var(--s-2) var(--s-3)",
        border: "1px solid color-mix(in oklch, var(--silk-gold) 22%, var(--ash-deep))",
        background: "color-mix(in oklch, var(--silk-gold) 4%, transparent)",
        borderRadius: 0
      }
    },
    /* @__PURE__ */ React.createElement(
      "div",
      {
        style: {
          fontFamily: "var(--serif)",
          fontStyle: "italic",
          fontSize: 14,
          lineHeight: 1.6,
          color: "var(--silk-gold)"
        }
      },
      "\u2726 ce cercle a \xE9t\xE9. ",
      _relWhen(circle.closed_at),
      ", il s'est referm\xE9 sur lui-m\xEAme."
    )
  ), /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "row mb-l",
      style: {
        gap: 0,
        flexWrap: "wrap",
        borderBottom: "1px solid var(--ash-deep)",
        marginBottom: "var(--s-5)"
      }
    },
    TABS.map(([k, label]) => {
      const active = tab === k;
      return /* @__PURE__ */ React.createElement(
        "button",
        {
          key: k,
          onClick: () => setTab(k),
          style: {
            background: "transparent",
            border: "none",
            borderBottom: active ? "2px solid var(--silk-gold)" : "2px solid transparent",
            padding: "10px 16px",
            fontFamily: "var(--serif)",
            fontStyle: "italic",
            fontSize: 15,
            color: active ? "var(--silk-gold)" : "var(--ash-light)",
            cursor: "pointer",
            transition: "all 280ms ease",
            marginBottom: -1
          }
        },
        label
      );
    })
  ), window.GeoSymbol && (() => {
    const glyphForTab = {
      portrait: "concentric",
      rituels: "croissant",
      cloture: "triangle"
    };
    const kind = glyphForTab[tab];
    if (!kind) return null;
    return /* @__PURE__ */ React.createElement("div", { "aria-hidden": "true", style: {
      display: "flex",
      justifyContent: "center",
      marginTop: "calc(-1 * var(--s-3))",
      marginBottom: "var(--s-3)",
      height: 36,
      position: "relative"
    } }, /* @__PURE__ */ React.createElement("div", { style: { position: "relative", width: 32, height: 32, opacity: 0.55 } }, /* @__PURE__ */ React.createElement(
      window.GeoSymbol,
      {
        kind,
        color: "silk",
        style: { position: "relative", width: 32, height: 32, opacity: 1 }
      }
    )));
  })(), tab === "synchronicites" && window.GeoSymbol && /* @__PURE__ */ React.createElement("div", { "aria-hidden": "true", style: {
    position: "absolute",
    inset: 0,
    opacity: 0.1,
    pointerEvents: "none",
    zIndex: 0
  } }, /* @__PURE__ */ React.createElement(
    window.GeoSymbol,
    {
      kind: "songlines",
      color: "silk",
      style: { position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 1 }
    }
  )), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", zIndex: 1 } }, tab === "membres" && /* @__PURE__ */ React.createElement(TabMembres, { circle, members, circleId }), tab === "closure" && /* @__PURE__ */ React.createElement(TabCloture, { circle, circleId }), tab === "depots" && /* @__PURE__ */ React.createElement(TabDepots, { circle, circleId, go }), tab === "chat" && /* @__PURE__ */ React.createElement(TabChat, { circleId }), tab === "portrait" && /* @__PURE__ */ React.createElement(TabPortrait, { circleId }), tab === "intentions" && /* @__PURE__ */ React.createElement(TabIntentions, { circleId }), tab === "synchronicites" && (window.TabSynchronicites ? /* @__PURE__ */ React.createElement(window.TabSynchronicites, { circleId }) : /* @__PURE__ */ React.createElement("div", { className: "meta op-70" }, "module synchronicit\xE9s non charg\xE9.")), tab === "meteo" && (window.TabMeteo ? /* @__PURE__ */ React.createElement(window.TabMeteo, { circleId }) : /* @__PURE__ */ React.createElement("div", { className: "meta op-70" }, "module m\xE9t\xE9o non charg\xE9.")), tab === "annales" && (window.TabAnnales ? /* @__PURE__ */ React.createElement(window.TabAnnales, { circleId }) : /* @__PURE__ */ React.createElement("div", { className: "meta op-70" }, "module annales non charg\xE9.")), tab === "rituels" && (window.TabRituels ? /* @__PURE__ */ React.createElement(window.TabRituels, { circleId }) : /* @__PURE__ */ React.createElement("div", { className: "meta op-70" }, "module rituels non charg\xE9.")))), window.FeedbackFloat && /* @__PURE__ */ React.createElement(window.FeedbackFloat, null));
};
Object.assign(window, { CercleSubApp });
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic2NyZWVucy1jZXJjbGUtc3ViYXBwLmpzeCJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLyogZ2xvYmFsIFJlYWN0ICovXG4vLyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vIERyZWFtIFYxLjIgXHUyMDE0IENlcmNsZVN1YkFwcCAocmVmb250ZSAyMDI2LTA0LTI4IFx1MjAxNCBZZXNodWEpXG4vL1xuLy8gU3BlYyA6IDJfREVTSUdOLm1kIFx1MDBBNzExLmJpcy4yMC4xMSAoQ2VyY2xlIGF2ZWMgSUEgZ2FyZGllbm5lKVxuLy8gICAgICAgIDNfVEVDSE5JQ0FMLm1kIFx1MDBBNzM5LjUvMzkuNiAodGFibGVzICsgcm91dGVzIGNpcmNsZS8qKVxuLy9cbi8vIFJlZm9udGUgZHUgQ2VyY2xlIGVuIHNvdXMtYXBwIFx1MDBFMCA1IG9uZ2xldHMgOlxuLy8gICAxLiBNZW1icmVzICAgICAgICBcdTIwMTQgclx1MDBFOXV0aWxpc2UgY2lyY2xlX21lbWJlcnMgKGRhdGEgZFx1MDBFOWpcdTAwRTAgZXhpc3RhbnRlKVxuLy8gICAyLiBEXHUwMEU5cFx1MDBGNHRzICAgICAgICAgXHUyMDE0IHJcdTAwRTl1dGlsaXNlIGNpcmNsZV9zaGFyZXMgKyByZXN0aXR1dGlvbnMgKENlcmNsZURldGFpbCBsZWdhY3kpXG4vLyAgIDMuIENoYXQgY2VyY2xlICAgIFx1MjAxNCBORVcgOiBjaGF0IElBIGdhcmRpZW5uZSB2aWEgL2FwaS9jaXJjbGVzL1tpZF0vY2hhdC9jb252ZXJzZVxuLy8gICA0LiBQb3J0cmFpdCAgICAgICBcdTIwMTQgTkVXIDogbGV0dHJlIG1lbnN1ZWxsZSB2aWEgL2FwaS9jaXJjbGVzL1tpZF0vcG9ydHJhaXQvZ2VuZXJhdGVcbi8vICAgNS4gSW50ZW50aW9ucyAgICAgXHUyMDE0IE5FVyA6IENSVUQgdmlhIC9hcGkvY2lyY2xlcy9baWRdL2ludGVudGlvbnNcbi8vXG4vLyBSb3V0aW5nIDogd2luZG93LkNlcmNsZVN1YkFwcCBwcmVuZCBsYSBwbGFjZSBkZSB3aW5kb3cuQ2VyY2xlRGV0YWlsIGRhbnMgYXBwLmpzeFxuLy8gKGZhbGxiYWNrIGdyYWNpZXV4IHN1ciBDZXJjbGVEZXRhaWwgbGVnYWN5IHNpIHdpbmRvdy5DZXJjbGVTdWJBcHAgbidlc3QgcGFzIGRpc3BvKS5cbi8vXG4vLyBTdHlsZSA6IG5pZ2h0LXdhcm0gKyBFQiBHYXJhbW9uZCBpdGFsaWMgKyBjaGlwcywgY29uZm9ybVx1MDBFOW1lbnQgYXV4IGF1dHJlcyBcdTAwRTljcmFucy5cbi8vIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5jb25zdCB7IHVzZVN0YXRlOiB1U0FTLCB1c2VFZmZlY3Q6IHVTQUUsIHVzZU1lbW86IHVTQU0sIHVzZVJlZjogdVNBUiwgdXNlQ2FsbGJhY2s6IHVTQUMgfSA9IFJlYWN0O1xuXG4vLyBcdTI1MDBcdTI1MDAgSGVscGVycyBwYXJ0YWdcdTAwRTlzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuZnVuY3Rpb24gX3JlbFdoZW4oaXNvKSB7XG4gIGlmICghaXNvKSByZXR1cm4gXCJyXHUwMEU5Y2VtbWVudFwiO1xuICB0cnkge1xuICAgIHJldHVybiB3aW5kb3cuRHJlYW1BUEk/Ll9yZWxhdGl2ZVdoZW4/Lihpc28pIHx8IFwiclx1MDBFOWNlbW1lbnRcIjtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIFwiclx1MDBFOWNlbW1lbnRcIjtcbiAgfVxufVxuXG5mdW5jdGlvbiBfZ2x5cGgoaWR4KSB7XG4gIGNvbnN0IGcgPSBbXCJcdTAzQjFcIiwgXCJcdTAzQjJcIiwgXCJcdTAzQjNcIiwgXCJcdTAzQjRcIiwgXCJcdTAzQjVcIiwgXCJcdTAzQjZcIiwgXCJcdTAzQjdcIiwgXCJcdTAzQjhcIiwgXCJcdTAzQjlcIiwgXCJcdTAzQkFcIiwgXCJcdTAzQkJcIiwgXCJcdTAzQkNcIl07XG4gIHJldHVybiBnW2lkeCAlIGcubGVuZ3RoXTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gX2F1dGhlZEZldGNoKHVybCwgb3B0cyA9IHt9KSB7XG4gIC8vIFJcdTAwRTl1dGlsaXNlIGxlIGJyaWRnZSBBdXRoIHNpIGRpc3BvIChCZWFyZXIgdG9rZW4pLCBzaW5vbiBsYWlzc2UgcGFzc2VyLlxuICBsZXQgaGVhZGVycyA9IHsgLi4uKG9wdHMuaGVhZGVycyB8fCB7fSkgfTtcbiAgdHJ5IHtcbiAgICBjb25zdCBzZXNzID0gd2luZG93LkRyZWFtQXV0aD8uZ2V0U2Vzc2lvbj8uKCk7XG4gICAgY29uc3QgdG9rZW4gPSBzZXNzPy5hY2Nlc3NfdG9rZW47XG4gICAgaWYgKHRva2VuKSBoZWFkZXJzW1wiQXV0aG9yaXphdGlvblwiXSA9IFwiQmVhcmVyIFwiICsgdG9rZW47XG4gIH0gY2F0Y2gge31cbiAgaWYgKG9wdHMuYm9keSAmJiAhaGVhZGVyc1tcIkNvbnRlbnQtVHlwZVwiXSkgaGVhZGVyc1tcIkNvbnRlbnQtVHlwZVwiXSA9IFwiYXBwbGljYXRpb24vanNvblwiO1xuICByZXR1cm4gZmV0Y2godXJsLCB7IC4uLm9wdHMsIGhlYWRlcnMgfSk7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBPbmdsZXQgOiBNZW1icmVzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuY29uc3QgVGFiTWVtYnJlcyA9ICh7IGNpcmNsZSwgbWVtYmVycywgY2lyY2xlSWQgfSkgPT4ge1xuICBjb25zdCBjb3VudCA9IG1lbWJlcnM/Lmxlbmd0aCB8fCBjaXJjbGU/Lm1lbWJlcl9jb3VudCB8fCAxO1xuICBjb25zdCBbaW52aXRlRGF0YSwgc2V0SW52aXRlRGF0YV0gPSB1U0FTKG51bGwpOyAvLyB7IHRva2VuLCBzaGFyZV91cmwsIGV4cGlyZXNfYXQsIHVzZXNfcmVtYWluaW5nIH1cbiAgY29uc3QgW2NyZWF0aW5nLCBzZXRDcmVhdGluZ10gPSB1U0FTKGZhbHNlKTtcbiAgY29uc3QgW2Vycm9yLCBzZXRFcnJvcl0gPSB1U0FTKG51bGwpO1xuICBjb25zdCBbY29waWVkLCBzZXRDb3BpZWRdID0gdVNBUyhmYWxzZSk7XG5cbiAgY29uc3QgZ2VuZXJhdGVJbnZpdGUgPSBhc3luYyAoKSA9PiB7XG4gICAgc2V0Q3JlYXRpbmcodHJ1ZSk7XG4gICAgc2V0RXJyb3IobnVsbCk7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHIgPSBhd2FpdCBfYXV0aGVkRmV0Y2goYC9hcGkvY2lyY2xlcy8ke2VuY29kZVVSSUNvbXBvbmVudChjaXJjbGVJZCl9L2ludml0YXRpb25zYCwge1xuICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IHVzZXNfcmVtYWluaW5nOiAxMiwgZXhwaXJlc19pbl9kYXlzOiAxNCB9KSxcbiAgICAgIH0pO1xuICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHIuanNvbigpO1xuICAgICAgaWYgKCFyLm9rKSB7XG4gICAgICAgIHNldEVycm9yKGRhdGE/LmVycm9yIHx8IFwiZ1x1MDBFOW5cdTAwRTlyYXRpb24gaW1wb3NzaWJsZVwiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNldEludml0ZURhdGEoZGF0YSk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgc2V0RXJyb3IoZT8ubWVzc2FnZSB8fCBcImdcdTAwRTluXHUwMEU5cmF0aW9uIGltcG9zc2libGVcIik7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHNldENyZWF0aW5nKGZhbHNlKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgZG9Db3B5ID0gYXN5bmMgKCkgPT4ge1xuICAgIGlmICghaW52aXRlRGF0YT8uc2hhcmVfdXJsKSByZXR1cm47XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IG5hdmlnYXRvci5jbGlwYm9hcmQ/LndyaXRlVGV4dChpbnZpdGVEYXRhLnNoYXJlX3VybCk7XG4gICAgICBzZXRDb3BpZWQodHJ1ZSk7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHNldENvcGllZChmYWxzZSksIDIyMDApO1xuICAgIH0gY2F0Y2gge31cbiAgfTtcblxuICBjb25zdCBkb1NoYXJlID0gYXN5bmMgKCkgPT4ge1xuICAgIGlmICghaW52aXRlRGF0YT8uc2hhcmVfdXJsKSByZXR1cm47XG4gICAgaWYgKG5hdmlnYXRvci5zaGFyZSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgbmF2aWdhdG9yLnNoYXJlKHtcbiAgICAgICAgICB0aXRsZTogKGNpcmNsZT8ubmFtZSB8fCBcImNlcmNsZVwiKSArIFwiIFx1MDBCNyBEcmVhbVwiLFxuICAgICAgICAgIHRleHQ6IFwidHUgZXMgaW52aXRcdTAwRTlcdTAwQjdlIFx1MDBFMCB0ZW5pciBjZSBjZXJjbGUgZGFucyBEcmVhbVwiLFxuICAgICAgICAgIHVybDogaW52aXRlRGF0YS5zaGFyZV91cmwsXG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCB7fVxuICAgIH0gZWxzZSB7XG4gICAgICBkb0NvcHkoKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3Qgb3BlblByZXZpZXcgPSAoKSA9PiB7XG4gICAgaWYgKGludml0ZURhdGE/LnNoYXJlX3VybCkgd2luZG93Lm9wZW4oaW52aXRlRGF0YS5zaGFyZV91cmwsIFwiX2JsYW5rXCIsIFwibm9vcGVuZXJcIik7XG4gIH07XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2PlxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9XCJtZXRhIG9wLTcwIG1iLWxcIlxuICAgICAgICBzdHlsZT17eyBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIG1heFdpZHRoOiA1NjAgfX1cbiAgICAgID5cbiAgICAgICAge2NvdW50fSB7Y291bnQgPiAxID8gXCJwZXJzb25uZXMgdGllbm5lbnRcIiA6IFwicGVyc29ubmUgdGllbnRcIn0gY2UgY2VyY2xlLiBsZXMgcHNldWRvcyBzb250IGdcdTAwRTluXHUwMEU5cmlxdWVzIFx1MjAxNCBsJ2lkZW50aXRcdTAwRTkgZXN0IHBvcnRcdTAwRTllIHBhciBsYSB2b2l4LCBwYXMgcGFyIGxlIG5vbS5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3cgbWIteGxcIiBzdHlsZT17eyBnYXA6IDEwLCBmbGV4V3JhcDogXCJ3cmFwXCIgfX0+XG4gICAgICAgIHtBcnJheS5mcm9tKHsgbGVuZ3RoOiBNYXRoLm1pbihjb3VudCwgMTIpIH0sIChfLCBpKSA9PiAoXG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAga2V5PXtpfVxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgd2lkdGg6IDQwLCBoZWlnaHQ6IDQwLCBib3JkZXJSYWRpdXM6IFwiNTAlXCIsXG4gICAgICAgICAgICAgIGJvcmRlcjogXCIxcHggc29saWQgdmFyKC0tYXNoLWRlZXApXCIsXG4gICAgICAgICAgICAgIGRpc3BsYXk6IFwiZ3JpZFwiLCBwbGFjZUl0ZW1zOiBcImNlbnRlclwiLFxuICAgICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsXG4gICAgICAgICAgICAgIGZvbnRTaXplOiAxNSwgY29sb3I6IFwidmFyKC0tYXNoLWxpZ2h0KVwiLFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBcImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc3RvbmUtY29vbCkgNCUsIHRyYW5zcGFyZW50KVwiLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7X2dseXBoKGkpfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApKX1cbiAgICAgICAge2NvdW50ID4gMTIgJiYgKFxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIixcbiAgICAgICAgICAgIGNvbG9yOiBcInZhcigtLWFzaC1saWdodClcIiwgZm9udFNpemU6IDE0LCBhbGlnblNlbGY6IFwiY2VudGVyXCIsXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgICAre2NvdW50IC0gMTJ9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICl9XG4gICAgICA8L2Rpdj5cblxuICAgICAgey8qIEJvdXRvbiBcIlx1MjcyNiBpbnZpdGVyXCIgKFQxIE5pdmVhdSAzKSBcdTIwMTQgaW52aXRhdGlvbiBtYWdpcXVlICovfVxuICAgICAgeyFpbnZpdGVEYXRhICYmIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC1sXCI+XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuLWdob3N0XCJcbiAgICAgICAgICAgIG9uQ2xpY2s9e2dlbmVyYXRlSW52aXRlfVxuICAgICAgICAgICAgZGlzYWJsZWQ9e2NyZWF0aW5nIHx8ICEhY2lyY2xlPy5jbG9zZWRfYXR9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge2NyZWF0aW5nID8gXCJcdTIwMjZcIiA6IFwiXHUyNzI2IGludml0ZXJcIn1cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICB7ZXJyb3IgJiYgKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZXRhIG10LXNcIiBzdHlsZT17e1xuICAgICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1lbWJlci1saXZlKVwiLCBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAge2Vycm9yfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuXG4gICAgICB7aW52aXRlRGF0YSAmJiAoXG4gICAgICAgIDxkaXZcbiAgICAgICAgICBjbGFzc05hbWU9XCJjYXJkIG10LWxcIlxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBwYWRkaW5nOiBcInZhcigtLXMtNClcIixcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDQlLCB2YXIoLS1uaWdodC1mbG9vcikpXCIsXG4gICAgICAgICAgICBib3JkZXI6IFwiMXB4IHNvbGlkIGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSAyMiUsIHZhcigtLWFzaC1kZWVwKSlcIixcbiAgICAgICAgICAgIGJvcmRlclJhZGl1czogMCxcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZXRhLW1vbm8gbWItc1wiIHN0eWxlPXt7XG4gICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLW1vbm8pXCIsIGZvbnRTaXplOiAxMCwgbGV0dGVyU3BhY2luZzogXCIwLjE0ZW1cIixcbiAgICAgICAgICAgIGNvbG9yOiBcInZhcigtLXNpbGstZ29sZClcIiwgdGV4dFRyYW5zZm9ybTogXCJ1cHBlcmNhc2VcIixcbiAgICAgICAgICB9fT5cbiAgICAgICAgICAgIFx1MjcyNiBsaWVuIGQnaW52aXRhdGlvbiBwclx1MDBFQXRcbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8cFxuICAgICAgICAgICAgY2xhc3NOYW1lPVwic2V1aWwtaXRhbGljIG1iLW1cIlxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgY29sb3I6IFwidmFyKC0tYm9uZSlcIiwgZm9udFNpemU6IDE0LCBsaW5lSGVpZ2h0OiAxLjYsXG4gICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgbWF4V2lkdGg6IDQ4MCxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgcGFydGFnZSBjZSBsaWVuIFx1MDBFMCBxdWkgdHUgdmV1eCBpbnZpdGVyLiBpbCByXHUwMEU5dlx1MDBFOGxlIGwnaW50ZW50aW9uIGR1IGNlcmNsZSBcdTIwMTRcbiAgICAgICAgICAgIGphbWFpcyBsZXMgbm9tcyBkZXMgbWVtYnJlcy4ge2ludml0ZURhdGEudXNlc19yZW1haW5pbmd9IHV0aWxpc2F0aW9uc1xuICAgICAgICAgICAgcmVzdGFudGVzIFx1MDBCNyBleHBpcmUge19yZWxXaGVuKGludml0ZURhdGEuZXhwaXJlc19hdCl9LlxuICAgICAgICAgIDwvcD5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJjYXJkIG1iLW1cIlxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcGFkZGluZzogXCJ2YXIoLS1zLTMpIHZhcigtLXMtNClcIixcbiAgICAgICAgICAgICAgYmFja2dyb3VuZDogXCJ2YXIoLS1uaWdodC1mbG9vcilcIixcbiAgICAgICAgICAgICAgYm9yZGVyOiBcIjFweCBzb2xpZCB2YXIoLS1hc2gtZGVlcClcIixcbiAgICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1tb25vKVwiLFxuICAgICAgICAgICAgICBmb250U2l6ZTogMTIsXG4gICAgICAgICAgICAgIGNvbG9yOiBcInZhcigtLWFzaC1saWdodClcIixcbiAgICAgICAgICAgICAgd29yZEJyZWFrOiBcImJyZWFrLWFsbFwiLFxuICAgICAgICAgICAgICB1c2VyU2VsZWN0OiBcImFsbFwiLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7aW52aXRlRGF0YS5zaGFyZV91cmx9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3cgZ2FwLXNcIiBzdHlsZT17eyBmbGV4V3JhcDogXCJ3cmFwXCIgfX0+XG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0bi1naG9zdFwiIG9uQ2xpY2s9e2RvQ29weX0+XG4gICAgICAgICAgICAgIHtjb3BpZWQgPyBcIlx1MjcxMyBjb3BpXHUwMEU5XCIgOiBcImNvcGllciBsZSBsaWVuXCJ9XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIHt0eXBlb2YgbmF2aWdhdG9yICE9PSBcInVuZGVmaW5lZFwiICYmIG5hdmlnYXRvci5zaGFyZSAmJiAoXG4gICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuLXRleHRcIiBvbkNsaWNrPXtkb1NoYXJlfT5cbiAgICAgICAgICAgICAgICBwYXJ0YWdlclx1MjAyNlxuICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0bi10ZXh0XCIgb25DbGljaz17b3BlblByZXZpZXd9IHN0eWxlPXt7IGNvbG9yOiBcInZhcigtLWFzaC1saWdodClcIiB9fT5cbiAgICAgICAgICAgICAgdm9pciBsZSBwcmV2aWV3XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuLXRleHRcIlxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7IHNldEludml0ZURhdGEobnVsbCk7IHNldENvcGllZChmYWxzZSk7IH19XG4gICAgICAgICAgICAgIHN0eWxlPXt7IGNvbG9yOiBcInZhcigtLWFzaC1saWdodClcIiB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICBnXHUwMEU5blx1MDBFOXJlciB1biBhdXRyZVxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbi8vIFx1MjUwMFx1MjUwMCBPbmdsZXQgOiBEXHUwMEU5cFx1MDBGNHRzIChyXHUwMEU5dXRpbGlzZSBDZXJjbGVEZXRhaWwgbGVnYWN5IHNpIGRpc3BvKSBcdTI1MDBcdTI1MDBcbmNvbnN0IFRhYkRlcG90cyA9ICh7IGNpcmNsZSwgY2lyY2xlSWQsIGdvIH0pID0+IHtcbiAgLy8gUG91ciBNVlAgXHUyMDE0IG9uIHJlbmQgbGEgdmVyc2lvbiBsZWdhY3kgQ2VyY2xlRGV0YWlsIChyZXN0aXR1dGlvbnMgKyBvcHQtaW4ga2Fpcm9zKVxuICAvLyBkYW5zIHVuZSB2ZXJzaW9uIGNvbmRlbnNcdTAwRTllLiBTaSB3aW5kb3cuQ2VyY2xlRGV0YWlsIGV4aXN0ZSwgb24gZFx1MDBFOWxcdTAwRThndWUuXG4gIGlmICh3aW5kb3cuQ2VyY2xlRGV0YWlsKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZHJlYW0tY2VyY2xlLWxlZ2FjeS1ob3N0XCI+XG4gICAgICAgIDx3aW5kb3cuQ2VyY2xlRGV0YWlsIGdvPXtnb30gY2lyY2xlSWQ9e2NpcmNsZUlkfSAvPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwibWV0YSBvcC03MFwiIHN0eWxlPXt7IGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiB9fT5cbiAgICAgIGxlcyBkXHUwMEU5cFx1MDBGNHRzIHMnYWZmaWNoZXJvbnQgaWNpIHVuZSBmb2lzIGxlIG1vZHVsZSBsZWdhY3kgY2hhcmdcdTAwRTkuXG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG4vLyBcdTI1MDBcdTI1MDAgT25nbGV0IDogQ2hhdCBjZXJjbGUgKElBIGdhcmRpZW5uZSkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5jb25zdCBUYWJDaGF0ID0gKHsgY2lyY2xlSWQgfSkgPT4ge1xuICBjb25zdCBbbWVzc2FnZXMsIHNldE1lc3NhZ2VzXSA9IHVTQVMoW10pO1xuICBjb25zdCBbbG9hZGluZywgc2V0TG9hZGluZ10gPSB1U0FTKHRydWUpO1xuICBjb25zdCBbaW5wdXQsIHNldElucHV0XSA9IHVTQVMoXCJcIik7XG4gIGNvbnN0IFtzZW5kaW5nLCBzZXRTZW5kaW5nXSA9IHVTQVMoZmFsc2UpO1xuICBjb25zdCBbc3RyZWFtaW5nLCBzZXRTdHJlYW1pbmddID0gdVNBUyhcIlwiKTsgLy8gYnVmZmVyIHN0cmVhbWluZyBJQVxuICBjb25zdCBbZXJyb3IsIHNldEVycm9yXSA9IHVTQVMobnVsbCk7XG4gIGNvbnN0IHNjcm9sbFJlZiA9IHVTQVIobnVsbCk7XG5cbiAgY29uc3QgZmV0Y2hNZXNzYWdlcyA9IHVTQUMoYXN5bmMgKCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByID0gYXdhaXQgX2F1dGhlZEZldGNoKGAvYXBpL2NpcmNsZXMvJHtjaXJjbGVJZH0vY2hhdC9jb252ZXJzZWApO1xuICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHIuanNvbigpO1xuICAgICAgaWYgKGRhdGE/Lm1lc3NhZ2VzKSBzZXRNZXNzYWdlcyhkYXRhLm1lc3NhZ2VzKTtcbiAgICAgIHNldExvYWRpbmcoZmFsc2UpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUud2FybihcIltUYWJDaGF0XSBmZXRjaCBmYWlsZWQ6XCIsIGU/Lm1lc3NhZ2UpO1xuICAgICAgc2V0TG9hZGluZyhmYWxzZSk7XG4gICAgfVxuICB9LCBbY2lyY2xlSWRdKTtcblxuICB1U0FFKCgpID0+IHsgZmV0Y2hNZXNzYWdlcygpOyB9LCBbZmV0Y2hNZXNzYWdlc10pO1xuXG4gIHVTQUUoKCkgPT4ge1xuICAgIGlmIChzY3JvbGxSZWYuY3VycmVudCkge1xuICAgICAgc2Nyb2xsUmVmLmN1cnJlbnQuc2Nyb2xsVG9wID0gc2Nyb2xsUmVmLmN1cnJlbnQuc2Nyb2xsSGVpZ2h0O1xuICAgIH1cbiAgfSwgW21lc3NhZ2VzLCBzdHJlYW1pbmddKTtcblxuICBjb25zdCBzZW5kID0gYXN5bmMgKG92ZXJyaWRlVGV4dCwgdm9pY2VNZXRhKSA9PiB7XG4gICAgY29uc3QgdGV4dCA9ICh0eXBlb2Ygb3ZlcnJpZGVUZXh0ID09PSBcInN0cmluZ1wiID8gb3ZlcnJpZGVUZXh0IDogaW5wdXQpLnRyaW0oKTtcbiAgICBpZiAoIXRleHQgfHwgc2VuZGluZykgcmV0dXJuO1xuICAgIHNldFNlbmRpbmcodHJ1ZSk7XG4gICAgc2V0RXJyb3IobnVsbCk7XG4gICAgc2V0U3RyZWFtaW5nKFwiXCIpO1xuICAgIGlmICh0eXBlb2Ygb3ZlcnJpZGVUZXh0ICE9PSBcInN0cmluZ1wiKSBzZXRJbnB1dChcIlwiKTtcblxuICAgIC8vIE9wdGltaXN0aWMgXHUyMDE0IHB1c2ggdXNlciBtZXNzYWdlXG4gICAgY29uc3Qgb3B0aW1pc3RpYyA9IHtcbiAgICAgIGlkOiBcInRtcC1cIiArIERhdGUubm93KCksXG4gICAgICB1c2VyX2lkOiBcIm1lXCIsXG4gICAgICBpc19haV9nYXJkaWVubmU6IGZhbHNlLFxuICAgICAgY29udGVudDogdGV4dCxcbiAgICAgIGNyZWF0ZWRfYXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgIGlzX3ZvaWNlOiAhIXZvaWNlTWV0YSxcbiAgICAgIHZvaWNlX2R1cmF0aW9uX21zOiB2b2ljZU1ldGE/LmR1cmF0aW9uX21zIHx8IG51bGwsXG4gICAgfTtcbiAgICBzZXRNZXNzYWdlcygobSkgPT4gWy4uLm0sIG9wdGltaXN0aWNdKTtcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCBwYXlsb2FkID0geyBtZXNzYWdlOiB0ZXh0IH07XG4gICAgICBpZiAodm9pY2VNZXRhKSB7XG4gICAgICAgIHBheWxvYWQuaXNfdm9pY2UgPSB0cnVlO1xuICAgICAgICBwYXlsb2FkLnZvaWNlX2R1cmF0aW9uX21zID0gdm9pY2VNZXRhLmR1cmF0aW9uX21zIHx8IG51bGw7XG4gICAgICAgIGlmICh2b2ljZU1ldGEubGFuZykgcGF5bG9hZC52b2ljZV90cmFuc2NyaXB0X2xhbmcgPSB2b2ljZU1ldGEubGFuZztcbiAgICAgIH1cbiAgICAgIGNvbnN0IHIgPSBhd2FpdCBfYXV0aGVkRmV0Y2goYC9hcGkvY2lyY2xlcy8ke2NpcmNsZUlkfS9jaGF0L2NvbnZlcnNlYCwge1xuICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShwYXlsb2FkKSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBjdCA9IHIuaGVhZGVycy5nZXQoXCJDb250ZW50LVR5cGVcIikgfHwgXCJcIjtcbiAgICAgIC8vIFNpIHBhcyBTU0UgKGNhcyBwYXMtdHJpZ2dlciBvdSBlcnJldXIgSlNPTiksIG9uIGxpdCBKU09OXG4gICAgICBpZiAoIWN0LmluY2x1ZGVzKFwidGV4dC9ldmVudC1zdHJlYW1cIikpIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHIuanNvbigpLmNhdGNoKCgpID0+ICh7fSkpO1xuICAgICAgICBpZiAoZGF0YT8uZXJyb3IpIHNldEVycm9yKGRhdGEuZXJyb3IpO1xuICAgICAgICAvLyByZWZyZXNoIGZ1bGxcbiAgICAgICAgYXdhaXQgZmV0Y2hNZXNzYWdlcygpO1xuICAgICAgICBzZXRTZW5kaW5nKGZhbHNlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBTU0Ugc3RyZWFtaW5nXG4gICAgICBjb25zdCByZWFkZXIgPSByLmJvZHkuZ2V0UmVhZGVyKCk7XG4gICAgICBjb25zdCBkZWNvZGVyID0gbmV3IFRleHREZWNvZGVyKCk7XG4gICAgICBsZXQgYnVmID0gXCJcIjtcbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIGNvbnN0IHsgZG9uZSwgdmFsdWUgfSA9IGF3YWl0IHJlYWRlci5yZWFkKCk7XG4gICAgICAgIGlmIChkb25lKSBicmVhaztcbiAgICAgICAgYnVmICs9IGRlY29kZXIuZGVjb2RlKHZhbHVlLCB7IHN0cmVhbTogdHJ1ZSB9KTtcbiAgICAgICAgY29uc3QgbGluZXMgPSBidWYuc3BsaXQoXCJcXG5cXG5cIik7XG4gICAgICAgIGJ1ZiA9IGxpbmVzLnBvcCgpIHx8IFwiXCI7XG4gICAgICAgIGZvciAoY29uc3QgbGluZSBvZiBsaW5lcykge1xuICAgICAgICAgIGNvbnN0IHQgPSBsaW5lLnRyaW0oKTtcbiAgICAgICAgICBpZiAoIXQuc3RhcnRzV2l0aChcImRhdGE6XCIpKSBjb250aW51ZTtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgZXYgPSBKU09OLnBhcnNlKHQuc2xpY2UoNSkudHJpbSgpKTtcbiAgICAgICAgICAgIGlmIChldi50eXBlID09PSBcImNodW5rXCIgJiYgZXYudGV4dCkge1xuICAgICAgICAgICAgICBzZXRTdHJlYW1pbmcoKHMpID0+IHMgKyBldi50ZXh0KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXYudHlwZSA9PT0gXCJzYW5jdHVhaXJlXCIgJiYgZXYudGV4dCkge1xuICAgICAgICAgICAgICBzZXRTdHJlYW1pbmcoZXYudGV4dCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGV2LnR5cGUgPT09IFwiZXJyb3JcIiAmJiBldi5lcnJvcikge1xuICAgICAgICAgICAgICBzZXRFcnJvcihldi5lcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBjYXRjaCB7fVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFJlZnJlc2ggY29tcGxldCBwb3VyIGF2b2lyIGwnXHUwMEU5dGF0IHNlcnZldXJcbiAgICAgIGF3YWl0IGZldGNoTWVzc2FnZXMoKTtcbiAgICAgIHNldFN0cmVhbWluZyhcIlwiKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBzZXRFcnJvcihlPy5tZXNzYWdlIHx8IFwiZW52b2kgbm9uIGFib3V0aVwiKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgc2V0U2VuZGluZyhmYWxzZSk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJzdGFjayBnYXAtbVwiPlxuICAgICAgPHBcbiAgICAgICAgY2xhc3NOYW1lPVwibWV0YSBvcC03MCBtYi1zXCJcbiAgICAgICAgc3R5bGU9e3sgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLCBtYXhXaWR0aDogNTYwIH19XG4gICAgICA+XG4gICAgICAgIGljaSBvbiBcdTAwRTljcml0IGVuc2VtYmxlLiBsJ0lBIGdhcmRpZW5uZSByZXN0ZSBzaWxlbmNpZXVzZSBcdTIwMTQgYXBwZWxsZS1sYSBhdmVjIEBBbmltYSBvdSAvZm9yXHUwMEVBdCAvc3ludGhcdTAwRThzZSAvaW50ZW50aW9uLlxuICAgICAgPC9wPlxuXG4gICAgICA8ZGl2XG4gICAgICAgIHJlZj17c2Nyb2xsUmVmfVxuICAgICAgICBjbGFzc05hbWU9XCJjYXJkXCJcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBwYWRkaW5nOiBcInZhcigtLXMtMykgdmFyKC0tcy00KVwiLFxuICAgICAgICAgIGJhY2tncm91bmQ6IFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1uaWdodC13YXJtKSA3MCUsIHZhcigtLW5pZ2h0LWZsb29yKSlcIixcbiAgICAgICAgICBib3JkZXI6IFwiMXB4IHNvbGlkIHZhcigtLWFzaC1kZWVwKVwiLCBib3JkZXJSYWRpdXM6IDAsXG4gICAgICAgICAgbWF4SGVpZ2h0OiA0ODAsIG92ZXJmbG93WTogXCJhdXRvXCIsXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIHtsb2FkaW5nID8gKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWV0YSBvcC03MFwiIHN0eWxlPXt7IGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiB9fT5cbiAgICAgICAgICAgIGNoYXJnZW1lbnRcdTIwMjZcbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKSA6IG1lc3NhZ2VzLmxlbmd0aCA9PT0gMCAmJiAhc3RyZWFtaW5nID8gKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWV0YSBvcC03MFwiIHN0eWxlPXt7IGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiB9fT5cbiAgICAgICAgICAgIGxlIGNlcmNsZSBlc3Qgc2lsZW5jaWV1eC4gZFx1MDBFOXBvc2UgbGUgcHJlbWllciBtb3QuXG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICkgOiAoXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzdGFjayBnYXAtc1wiPlxuICAgICAgICAgICAge21lc3NhZ2VzLm1hcCgobSkgPT4gKFxuICAgICAgICAgICAgICA8Q2hhdE1lc3NhZ2VSb3cga2V5PXttLmlkfSBtc2c9e219IC8+XG4gICAgICAgICAgICApKX1cbiAgICAgICAgICAgIHtzdHJlYW1pbmcgJiYgKFxuICAgICAgICAgICAgICA8Q2hhdE1lc3NhZ2VSb3dcbiAgICAgICAgICAgICAgICBtc2c9e3tcbiAgICAgICAgICAgICAgICAgIGlkOiBcInN0cmVhbWluZ1wiLFxuICAgICAgICAgICAgICAgICAgaXNfYWlfZ2FyZGllbm5lOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgY29udGVudDogc3RyZWFtaW5nLFxuICAgICAgICAgICAgICAgICAgdm9pY2VfYXR0cmlidXRpb246IFwiZ2FyZGllbm5lXCIsXG4gICAgICAgICAgICAgICAgICBjcmVhdGVkX2F0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICBzdHJlYW1pbmdcbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICl9XG4gICAgICA8L2Rpdj5cblxuICAgICAge2Vycm9yICYmIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZXRhXCIgc3R5bGU9e3tcbiAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1lbWJlci1saXZlKVwiLCBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsXG4gICAgICAgIH19PlxuICAgICAgICAgIHtlcnJvcn1cbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdyBnYXAtc1wiIHN0eWxlPXt7IGFsaWduSXRlbXM6IFwiZmxleC1lbmRcIiB9fT5cbiAgICAgICAgPHRleHRhcmVhXG4gICAgICAgICAgY2xhc3NOYW1lPVwiZmllbGQtdGV4dGFyZWFcIlxuICAgICAgICAgIHBsYWNlaG9sZGVyPVwiZFx1MDBFOXBvc2VyIHVuIG1vdCBkYW5zIGxlIGNlcmNsZVx1MjAyNlwiXG4gICAgICAgICAgdmFsdWU9e2lucHV0fVxuICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0SW5wdXQoZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgIHJvd3M9ezJ9XG4gICAgICAgICAgc3R5bGU9e3sgZmxleDogMSB9fVxuICAgICAgICAgIGRpc2FibGVkPXtzZW5kaW5nfVxuICAgICAgICAgIG9uS2V5RG93bj17KGUpID0+IHtcbiAgICAgICAgICAgIGlmIChlLmtleSA9PT0gXCJFbnRlclwiICYmICFlLnNoaWZ0S2V5KSB7XG4gICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgc2VuZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH19XG4gICAgICAgIC8+XG4gICAgICAgIHt3aW5kb3cuQ2hhdFZvaWNlTWljQnV0dG9uICYmIChcbiAgICAgICAgICA8d2luZG93LkNoYXRWb2ljZU1pY0J1dHRvblxuICAgICAgICAgICAgZGlzYWJsZWQ9e3NlbmRpbmd9XG4gICAgICAgICAgICBvblRyYW5zY3JpYmVkPXsoeyB0cmFuc2NyaXB0LCBkdXJhdGlvbl9tcywgbGFuZyB9KSA9PiB7XG4gICAgICAgICAgICAgIGlmICh0cmFuc2NyaXB0KSBzZW5kKHRyYW5zY3JpcHQsIHsgZHVyYXRpb25fbXMsIGxhbmcgfSk7XG4gICAgICAgICAgICB9fVxuICAgICAgICAgIC8+XG4gICAgICAgICl9XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICBjbGFzc05hbWU9XCJidG4tZ2hvc3RcIlxuICAgICAgICAgIGRpc2FibGVkPXtzZW5kaW5nIHx8ICFpbnB1dC50cmltKCl9XG4gICAgICAgICAgb25DbGljaz17KCkgPT4gc2VuZCgpfVxuICAgICAgICAgIHN0eWxlPXt7IG1pbldpZHRoOiAxMDAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIHtzZW5kaW5nID8gXCJcdTIwMjZcIiA6IFwiZFx1MDBFOXBvc2VyXCJ9XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1ldGEgb3AtNTBcIiBzdHlsZT17e1xuICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLW1vbm8pXCIsIGZvbnRTaXplOiAxMCwgbGV0dGVyU3BhY2luZzogXCIwLjFlbVwiLFxuICAgICAgfX0+XG4gICAgICAgIEBBbmltYSBcdTAwQjcgL2Zvclx1MDBFQXQgXHUwMEI3IC9zeW50aFx1MDBFOHNlIFx1MDBCNyAvaW50ZW50aW9uXG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbmNvbnN0IENoYXRNZXNzYWdlUm93ID0gKHsgbXNnLCBzdHJlYW1pbmcgfSkgPT4ge1xuICBjb25zdCBhaSA9IG1zZy5pc19haV9nYXJkaWVubmU7XG4gIHJldHVybiAoXG4gICAgPGRpdlxuICAgICAgY2xhc3NOYW1lPVwiY2FyZFwiXG4gICAgICBzdHlsZT17e1xuICAgICAgICBwYWRkaW5nOiBcInZhcigtLXMtMykgdmFyKC0tcy00KVwiLFxuICAgICAgICBiYWNrZ3JvdW5kOiBhaVxuICAgICAgICAgID8gXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgNSUsIHZhcigtLW5pZ2h0LWZsb29yKSlcIlxuICAgICAgICAgIDogXCJ0cmFuc3BhcmVudFwiLFxuICAgICAgICBib3JkZXI6IGFpXG4gICAgICAgICAgPyBcIjFweCBzb2xpZCBjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgMjUlLCB2YXIoLS1hc2gtZGVlcCkpXCJcbiAgICAgICAgICA6IFwiMXB4IHNvbGlkIHZhcigtLWFzaC1kZWVwKVwiLFxuICAgICAgICBib3JkZXJSYWRpdXM6IDAsXG4gICAgICAgIG9wYWNpdHk6IHN0cmVhbWluZyA/IDAuODUgOiAxLFxuICAgICAgfX1cbiAgICA+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1ldGEtbW9ubyBtYi1zXCIgc3R5bGU9e3tcbiAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1tb25vKVwiLCBmb250U2l6ZTogMTAsIGxldHRlclNwYWNpbmc6IFwiMC4xMmVtXCIsXG4gICAgICAgIGNvbG9yOiBhaSA/IFwidmFyKC0tc2lsay1nb2xkKVwiIDogXCJ2YXIoLS1hc2gtbGlnaHQpXCIsXG4gICAgICAgIHRleHRUcmFuc2Zvcm06IFwidXBwZXJjYXNlXCIsXG4gICAgICB9fT5cbiAgICAgICAge2FpID8gKG1zZy52b2ljZV9hdHRyaWJ1dGlvbiB8fCBcImdhcmRpZW5uZVwiKSA6IFwidm9peCBkdSBjZXJjbGVcIn0gXHUwMEI3IHtfcmVsV2hlbihtc2cuY3JlYXRlZF9hdCl9XG4gICAgICAgIHttc2cudHJpZ2dlcmVkX2J5X2tleXdvcmQgJiYgKFxuICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IG1hcmdpbkxlZnQ6IDgsIG9wYWNpdHk6IDAuNyB9fT5cdTAwQjcge21zZy50cmlnZ2VyZWRfYnlfa2V5d29yZH08L3NwYW4+XG4gICAgICAgICl9XG4gICAgICAgIHttc2cuaXNfdm9pY2UgJiYgKFxuICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IG1hcmdpbkxlZnQ6IDgsIGNvbG9yOiBcInZhcigtLXNpbGstZ29sZClcIiB9fT5cbiAgICAgICAgICAgIFx1MDBCNyBcdUQ4M0NcdURGOTl7bXNnLnZvaWNlX2R1cmF0aW9uX21zID8gXCIgXCIgKyBNYXRoLnJvdW5kKG1zZy52b2ljZV9kdXJhdGlvbl9tcyAvIDEwMDApICsgXCJzXCIgOiBcIlwifVxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgKX1cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLFxuICAgICAgICBmb250U3R5bGU6IGFpID8gXCJpdGFsaWNcIiA6IFwibm9ybWFsXCIsXG4gICAgICAgIGZvbnRTaXplOiAxNSwgbGluZUhlaWdodDogMS42LCBjb2xvcjogXCJ2YXIoLS1ib25lKVwiLFxuICAgICAgICB0ZXh0V3JhcDogXCJwcmV0dHlcIiwgd2hpdGVTcGFjZTogXCJwcmUtd3JhcFwiLFxuICAgICAgfX0+XG4gICAgICAgIHttc2cuY29udGVudH1cbiAgICAgICAge3N0cmVhbWluZyAmJiA8c3BhbiBzdHlsZT17eyBvcGFjaXR5OiAwLjUgfX0+XHUyNThEPC9zcGFuPn1cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuLy8gXHUyNTAwXHUyNTAwIE9uZ2xldCA6IFBvcnRyYWl0IGR1IGNlcmNsZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbmNvbnN0IFRhYlBvcnRyYWl0ID0gKHsgY2lyY2xlSWQgfSkgPT4ge1xuICBjb25zdCBbbGV0dHJlLCBzZXRMZXR0cmVdID0gdVNBUyhudWxsKTtcbiAgY29uc3QgW2xvYWRpbmcsIHNldExvYWRpbmddID0gdVNBUyhmYWxzZSk7XG4gIGNvbnN0IFtpbmZvLCBzZXRJbmZvXSA9IHVTQVMobnVsbCk7XG4gIGNvbnN0IFtlcnJvciwgc2V0RXJyb3JdID0gdVNBUyhudWxsKTtcblxuICBjb25zdCBnZW5lcmF0ZSA9IGFzeW5jIChmb3JjZSA9IGZhbHNlKSA9PiB7XG4gICAgc2V0TG9hZGluZyh0cnVlKTtcbiAgICBzZXRFcnJvcihudWxsKTtcbiAgICBzZXRJbmZvKG51bGwpO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByID0gYXdhaXQgX2F1dGhlZEZldGNoKGAvYXBpL2NpcmNsZXMvJHtjaXJjbGVJZH0vcG9ydHJhaXQvZ2VuZXJhdGVgLCB7XG4gICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgZm9yY2UgfSksXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByLmpzb24oKTtcbiAgICAgIGlmIChkYXRhPy5lcnJvcikge1xuICAgICAgICBzZXRFcnJvcihkYXRhLmVycm9yKTtcbiAgICAgIH0gZWxzZSBpZiAoZGF0YT8ua19hbm9ueW1pdHlfZmFpbGVkKSB7XG4gICAgICAgIHNldExldHRyZShudWxsKTtcbiAgICAgICAgc2V0SW5mbyhkYXRhLm1lc3NhZ2UgfHwgXCJwYXMgZW5jb3JlIGFzc2V6IGRlIHZvaXguXCIpO1xuICAgICAgfSBlbHNlIGlmIChkYXRhPy5lbXB0eSkge1xuICAgICAgICBzZXRMZXR0cmUobnVsbCk7XG4gICAgICAgIHNldEluZm8oZGF0YS5tZXNzYWdlIHx8IFwicmllbiBcdTAwRTAgdGlzc2VyIHBvdXIgbGUgbW9tZW50LlwiKTtcbiAgICAgIH0gZWxzZSBpZiAoZGF0YT8ubGV0dHJlKSB7XG4gICAgICAgIHNldExldHRyZShkYXRhLmxldHRyZSk7XG4gICAgICAgIHNldEluZm8oZGF0YS5jYWNoZWRcbiAgICAgICAgICA/IGB2ZXJzaW9uIGdcdTAwRTluXHUwMEU5clx1MDBFOWUgJHtfcmVsV2hlbihkYXRhLmdlbmVyYXRlZF9hdCl9IFx1MjAxNCBjYWNoZSBtZW5zdWVsYFxuICAgICAgICAgIDogXCJ2ZXJzaW9uIGZyYVx1MDBFRWNoZVwiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNldEVycm9yKFwiclx1MDBFOXBvbnNlIGluYXR0ZW5kdWVcIik7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgc2V0RXJyb3IoZT8ubWVzc2FnZSB8fCBcImdcdTAwRTluXHUwMEU5cmF0aW9uIG5vbiBhYm91dGllXCIpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBzZXRMb2FkaW5nKGZhbHNlKTtcbiAgICB9XG4gIH07XG5cbiAgdVNBRSgoKSA9PiB7IGdlbmVyYXRlKGZhbHNlKTsgLyogZXNsaW50LWRpc2FibGUtbmV4dC1saW5lICovIH0sIFtjaXJjbGVJZF0pO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJzdGFjayBnYXAtbVwiPlxuICAgICAgPHBcbiAgICAgICAgY2xhc3NOYW1lPVwibWV0YSBvcC03MFwiXG4gICAgICAgIHN0eWxlPXt7IGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgbWF4V2lkdGg6IDU2MCB9fVxuICAgICAgPlxuICAgICAgICB1bmUgbGV0dHJlIHRpc3NcdTAwRTllIGNoYXF1ZSBtb2lzIFx1MDBFMCBwYXJ0aXIgZGVzIG1vdGlmcyBjb2xsZWN0aWZzIGRcdTAwRTlwb3NcdTAwRTlzIGRhbnMgbGUgY2VyY2xlLiBhbm9ueW1lIHBhciBjb25zdHJ1Y3Rpb24uIGF1IG1vaW5zIDUgdm9peCBkb2l2ZW50IGF2b2lyIGNvbnRyaWJ1XHUwMEU5LlxuICAgICAgPC9wPlxuXG4gICAgICB7bG9hZGluZyAmJiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1jZW50ZXJcIiBzdHlsZT17eyBwYWRkaW5nOiBcInZhcigtLXMtNSlcIiB9fT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJyZWF0aFwiIHN0eWxlPXt7IG1hcmdpbjogXCIwIGF1dG9cIiB9fSAvPlxuICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInNldWlsLWl0YWxpYyBtdC1tXCIgc3R5bGU9e3sgY29sb3I6IFwidmFyKC0tYXNoLWxpZ2h0KVwiIH19PlxuICAgICAgICAgICAgbGEgbGV0dHJlIHNlIGZvcm1lLlxuICAgICAgICAgIDwvcD5cbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuXG4gICAgICB7IWxvYWRpbmcgJiYgbGV0dHJlICYmIChcbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzTmFtZT1cImNhcmRcIlxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBwYWRkaW5nOiBcInZhcigtLXMtNSkgdmFyKC0tcy00KVwiLFxuICAgICAgICAgICAgYmFja2dyb3VuZDogXCJ2YXIoLS1uaWdodC13YXJtKVwiLFxuICAgICAgICAgICAgYm9yZGVyOiBcIjFweCBzb2xpZCBjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgMTQlLCB2YXIoLS1hc2gtZGVlcCkpXCIsXG4gICAgICAgICAgICBib3JkZXJSYWRpdXM6IDAsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIHtpbmZvICYmIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWV0YS1tb25vIG1iLW1cIiBzdHlsZT17e1xuICAgICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLW1vbm8pXCIsIGZvbnRTaXplOiAxMCwgbGV0dGVyU3BhY2luZzogXCIwLjE0ZW1cIixcbiAgICAgICAgICAgICAgY29sb3I6IFwidmFyKC0tc2lsay1nb2xkKVwiLCB0ZXh0VHJhbnNmb3JtOiBcInVwcGVyY2FzZVwiLFxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIHtpbmZvfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKX1cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGZvbnRTaXplOiAxNyxcbiAgICAgICAgICAgIGxpbmVIZWlnaHQ6IDEuNywgY29sb3I6IFwidmFyKC0tYm9uZSlcIiwgdGV4dFdyYXA6IFwicHJldHR5XCIsXG4gICAgICAgICAgICB3aGl0ZVNwYWNlOiBcInByZS13cmFwXCIsXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgICB7bGV0dHJlfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG5cbiAgICAgIHshbG9hZGluZyAmJiAhbGV0dHJlICYmIGluZm8gJiYgKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmRcIiBzdHlsZT17e1xuICAgICAgICAgIHBhZGRpbmc6IFwidmFyKC0tcy00KVwiLCBiYWNrZ3JvdW5kOiBcInRyYW5zcGFyZW50XCIsXG4gICAgICAgICAgYm9yZGVyOiBcIjFweCBzb2xpZCB2YXIoLS1hc2gtZGVlcClcIiwgYm9yZGVyUmFkaXVzOiAwLFxuICAgICAgICB9fT5cbiAgICAgICAgICA8cCBjbGFzc05hbWU9XCJzZXVpbC1pdGFsaWNcIiBzdHlsZT17eyBjb2xvcjogXCJ2YXIoLS1hc2gtbGlnaHQpXCIsIG1heFdpZHRoOiA0ODAgfX0+XG4gICAgICAgICAgICB7aW5mb31cbiAgICAgICAgICA8L3A+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cblxuICAgICAge2Vycm9yICYmIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZXRhXCIgc3R5bGU9e3tcbiAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1lbWJlci1saXZlKVwiLCBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsXG4gICAgICAgIH19PlxuICAgICAgICAgIHtlcnJvcn1cbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdyBnYXAtbSBtdC1zXCIgc3R5bGU9e3sgZmxleFdyYXA6IFwid3JhcFwiIH19PlxuICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0bi1naG9zdFwiIGRpc2FibGVkPXtsb2FkaW5nfSBvbkNsaWNrPXsoKSA9PiBnZW5lcmF0ZSh0cnVlKX0+XG4gICAgICAgICAge2xvYWRpbmcgPyBcImdcdTAwRTluXHUwMEU5cmF0aW9uXHUyMDI2XCIgOiBcInJcdTAwRTlnXHUwMEU5blx1MDBFOXJlclwifVxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuLy8gXHUyNTAwXHUyNTAwIE9uZ2xldCA6IEludGVudGlvbnMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5jb25zdCBUYWJJbnRlbnRpb25zID0gKHsgY2lyY2xlSWQgfSkgPT4ge1xuICBjb25zdCBbaW50ZW50aW9ucywgc2V0SW50ZW50aW9uc10gPSB1U0FTKFtdKTtcbiAgY29uc3QgW2xvYWRpbmcsIHNldExvYWRpbmddID0gdVNBUyh0cnVlKTtcbiAgY29uc3QgW3Byb3Bvc2VPcGVuLCBzZXRQcm9wb3NlT3Blbl0gPSB1U0FTKGZhbHNlKTtcbiAgY29uc3QgW2RyYWZ0VGV4dCwgc2V0RHJhZnRUZXh0XSA9IHVTQVMoXCJcIik7XG4gIGNvbnN0IFtkcmFmdFVudGlsLCBzZXREcmFmdFVudGlsXSA9IHVTQVMoXCJcIik7XG4gIGNvbnN0IFtidXN5LCBzZXRCdXN5XSA9IHVTQVMoZmFsc2UpO1xuICBjb25zdCBbZXJyb3IsIHNldEVycm9yXSA9IHVTQVMobnVsbCk7XG5cbiAgY29uc3QgZmV0Y2hBbGwgPSB1U0FDKGFzeW5jICgpID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgciA9IGF3YWl0IF9hdXRoZWRGZXRjaChgL2FwaS9jaXJjbGVzLyR7Y2lyY2xlSWR9L2ludGVudGlvbnNgKTtcbiAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByLmpzb24oKTtcbiAgICAgIC8vIEZpbHRyZSBsZXMgbWFycXVldXJzIHBvcnRyYWl0IChuZSBwYXMgYWZmaWNoZXIgY29tbWUgaW50ZW50aW9ucylcbiAgICAgIGNvbnN0IGZpbHRlcmVkID0gKGRhdGE/LmludGVudGlvbnMgfHwgW10pLmZpbHRlcigoaSkgPT4gaS5pbnRlbnRpb25fdGV4dCAhPT0gXCJfX3BvcnRyYWl0X21lbnN1ZWxfX1wiKTtcbiAgICAgIHNldEludGVudGlvbnMoZmlsdGVyZWQpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUud2FybihcIltUYWJJbnRlbnRpb25zXSBmZXRjaCBmYWlsZWQ6XCIsIGU/Lm1lc3NhZ2UpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBzZXRMb2FkaW5nKGZhbHNlKTtcbiAgICB9XG4gIH0sIFtjaXJjbGVJZF0pO1xuXG4gIHVTQUUoKCkgPT4geyBmZXRjaEFsbCgpOyB9LCBbZmV0Y2hBbGxdKTtcblxuICBjb25zdCBwcm9wb3NlID0gYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHRleHQgPSBkcmFmdFRleHQudHJpbSgpO1xuICAgIGlmICghdGV4dCB8fCBidXN5KSByZXR1cm47XG4gICAgc2V0QnVzeSh0cnVlKTtcbiAgICBzZXRFcnJvcihudWxsKTtcbiAgICB0cnkge1xuICAgICAgY29uc3QgciA9IGF3YWl0IF9hdXRoZWRGZXRjaChgL2FwaS9jaXJjbGVzLyR7Y2lyY2xlSWR9L2ludGVudGlvbnNgLCB7XG4gICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICBpbnRlbnRpb25fdGV4dDogdGV4dCxcbiAgICAgICAgICBhY3RpdmVfdW50aWw6IGRyYWZ0VW50aWwgfHwgbnVsbCxcbiAgICAgICAgfSksXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByLmpzb24oKTtcbiAgICAgIGlmIChkYXRhPy5lcnJvcikgc2V0RXJyb3IoZGF0YS5lcnJvcik7XG4gICAgICBlbHNlIHtcbiAgICAgICAgc2V0RHJhZnRUZXh0KFwiXCIpO1xuICAgICAgICBzZXREcmFmdFVudGlsKFwiXCIpO1xuICAgICAgICBzZXRQcm9wb3NlT3BlbihmYWxzZSk7XG4gICAgICAgIGF3YWl0IGZldGNoQWxsKCk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgc2V0RXJyb3IoZT8ubWVzc2FnZSB8fCBcInByb3Bvc2l0aW9uIG5vbiBhYm91dGllXCIpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBzZXRCdXN5KGZhbHNlKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3Qgdm90ZSA9IGFzeW5jIChpbnRlbnRpb25JZCkgPT4ge1xuICAgIHNldEJ1c3kodHJ1ZSk7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IF9hdXRoZWRGZXRjaChgL2FwaS9jaXJjbGVzLyR7Y2lyY2xlSWR9L2ludGVudGlvbnMvJHtpbnRlbnRpb25JZH0vdm90ZWAsIHtcbiAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe30pLFxuICAgICAgfSk7XG4gICAgICBhd2FpdCBmZXRjaEFsbCgpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUud2FybihcIltUYWJJbnRlbnRpb25zXSB2b3RlIGZhaWxlZDpcIiwgZT8ubWVzc2FnZSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHNldEJ1c3koZmFsc2UpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBhcmNoaXZlID0gYXN5bmMgKGludGVudGlvbklkKSA9PiB7XG4gICAgaWYgKCFjb25maXJtKFwiYXJjaGl2ZXIgY2V0dGUgaW50ZW50aW9uID9cIikpIHJldHVybjtcbiAgICBzZXRCdXN5KHRydWUpO1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCBfYXV0aGVkRmV0Y2goYC9hcGkvY2lyY2xlcy8ke2NpcmNsZUlkfS9pbnRlbnRpb25zLyR7aW50ZW50aW9uSWR9YCwge1xuICAgICAgICBtZXRob2Q6IFwiREVMRVRFXCIsXG4gICAgICB9KTtcbiAgICAgIGF3YWl0IGZldGNoQWxsKCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS53YXJuKFwiW1RhYkludGVudGlvbnNdIGFyY2hpdmUgZmFpbGVkOlwiLCBlPy5tZXNzYWdlKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgc2V0QnVzeShmYWxzZSk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJzdGFjayBnYXAtbVwiPlxuICAgICAgPHBcbiAgICAgICAgY2xhc3NOYW1lPVwibWV0YSBvcC03MFwiXG4gICAgICAgIHN0eWxlPXt7IGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgbWF4V2lkdGg6IDU2MCB9fVxuICAgICAgPlxuICAgICAgICB1bmUgaW50ZW50aW9uIG4nZXN0IHBhcyB1biBvYmplY3RpZi4gYydlc3QgdW5lIG9yaWVudGF0aW9uIHF1ZSBsZSBjZXJjbGUgdGllbnQgZW5zZW1ibGUuIHByb3Bvc2UsIHZvdGUsIGxhaXNzZSB2aXZyZS5cbiAgICAgIDwvcD5cblxuICAgICAge2xvYWRpbmcgPyAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWV0YSBvcC03MFwiIHN0eWxlPXt7IGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiB9fT5cbiAgICAgICAgICBjaGFyZ2VtZW50XHUyMDI2XG4gICAgICAgIDwvZGl2PlxuICAgICAgKSA6IGludGVudGlvbnMubGVuZ3RoID09PSAwID8gKFxuICAgICAgICA8cCBjbGFzc05hbWU9XCJzZXVpbC1pdGFsaWNcIiBzdHlsZT17eyBjb2xvcjogXCJ2YXIoLS1hc2gtbGlnaHQpXCIgfX0+XG4gICAgICAgICAgYXVjdW5lIGludGVudGlvbiBhY3RpdmUuIHByb3Bvc2UgbGEgcHJlbWlcdTAwRThyZS5cbiAgICAgICAgPC9wPlxuICAgICAgKSA6IChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzdGFjayBnYXAtc1wiPlxuICAgICAgICAgIHtpbnRlbnRpb25zLm1hcCgoaXQpID0+IChcbiAgICAgICAgICAgIDxJbnRlbnRpb25Sb3dcbiAgICAgICAgICAgICAga2V5PXtpdC5pZH1cbiAgICAgICAgICAgICAgaW50ZW50aW9uPXtpdH1cbiAgICAgICAgICAgICAgb25Wb3RlPXsoKSA9PiB2b3RlKGl0LmlkKX1cbiAgICAgICAgICAgICAgb25BcmNoaXZlPXsoKSA9PiBhcmNoaXZlKGl0LmlkKX1cbiAgICAgICAgICAgICAgYnVzeT17YnVzeX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cblxuICAgICAge2Vycm9yICYmIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZXRhXCIgc3R5bGU9e3tcbiAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1lbWJlci1saXZlKVwiLCBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsXG4gICAgICAgIH19PlxuICAgICAgICAgIHtlcnJvcn1cbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuXG4gICAgICB7IXByb3Bvc2VPcGVuID8gKFxuICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0bi1naG9zdCBtdC1tXCIgb25DbGljaz17KCkgPT4gc2V0UHJvcG9zZU9wZW4odHJ1ZSl9PlxuICAgICAgICAgICsgcHJvcG9zZXIgdW5lIGludGVudGlvblxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICkgOiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZCBtdC1tXCIgc3R5bGU9e3tcbiAgICAgICAgICBwYWRkaW5nOiBcInZhcigtLXMtNClcIixcbiAgICAgICAgICBiYWNrZ3JvdW5kOiBcImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc3RvbmUtY29vbCkgNSUsIHZhcigtLW5pZ2h0LWZsb29yKSlcIixcbiAgICAgICAgICBib3JkZXI6IFwiMXB4IHNvbGlkIGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSAxOCUsIHZhcigtLWFzaC1kZWVwKSlcIixcbiAgICAgICAgICBib3JkZXJSYWRpdXM6IDAsXG4gICAgICAgIH19PlxuICAgICAgICAgIDx0ZXh0YXJlYVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiZmllbGQtdGV4dGFyZWEgbWItbVwiXG4gICAgICAgICAgICBwbGFjZWhvbGRlcj1cInRyYXZlcnNlciBjZXR0ZSBzYWlzb24gc2FucyBzZSBwclx1MDBFOWNpcGl0ZXIuIHRlbmlyIG5vcyBkXHUwMEU5c2FjY29yZHMgc2FucyByb21wcmUuIFx1MDBFOWNvdXRlciBjZSBxdWkgcmV2aWVudCBkYW5zIG5vcyByXHUwMEVBdmVzXHUyMDI2XCJcbiAgICAgICAgICAgIHZhbHVlPXtkcmFmdFRleHR9XG4gICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldERyYWZ0VGV4dChlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICByb3dzPXszfVxuICAgICAgICAgICAgYXV0b0ZvY3VzXG4gICAgICAgICAgLz5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdyBnYXAtcyBtYi1tXCIgc3R5bGU9e3sgYWxpZ25JdGVtczogXCJjZW50ZXJcIiB9fT5cbiAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJtZXRhIG9wLTcwXCIgc3R5bGU9e3tcbiAgICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLCBmb250U2l6ZTogMTMsXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgYWN0aXZlIGp1c3F1J2F1IChvcHRpb25uZWwpIDpcbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgdHlwZT1cImRhdGVcIlxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJmaWVsZC1pbnB1dFwiXG4gICAgICAgICAgICAgIHZhbHVlPXtkcmFmdFVudGlsfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldERyYWZ0VW50aWwoZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICBzdHlsZT17eyBtYXhXaWR0aDogMjAwIH19XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93IGdhcC1tXCIgc3R5bGU9e3sganVzdGlmeUNvbnRlbnQ6IFwiZmxleC1lbmRcIiB9fT5cbiAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuLXRleHRcIiBvbkNsaWNrPXsoKSA9PiBzZXRQcm9wb3NlT3BlbihmYWxzZSl9IGRpc2FibGVkPXtidXN5fT5cbiAgICAgICAgICAgICAgYW5udWxlclxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0bi1naG9zdFwiIG9uQ2xpY2s9e3Byb3Bvc2V9IGRpc2FibGVkPXtidXN5IHx8ICFkcmFmdFRleHQudHJpbSgpfT5cbiAgICAgICAgICAgICAge2J1c3kgPyBcIlx1MjAyNlwiIDogXCJwcm9wb3NlclwifVxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbmNvbnN0IEludGVudGlvblJvdyA9ICh7IGludGVudGlvbiwgb25Wb3RlLCBvbkFyY2hpdmUsIGJ1c3kgfSkgPT4ge1xuICBjb25zdCB1bnRpbCA9IGludGVudGlvbi5hY3RpdmVfdW50aWxcbiAgICA/IG5ldyBEYXRlKGludGVudGlvbi5hY3RpdmVfdW50aWwpLnRvTG9jYWxlRGF0ZVN0cmluZyhcImZyLUZSXCIpXG4gICAgOiBudWxsO1xuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIGNsYXNzTmFtZT1cImNhcmRcIlxuICAgICAgc3R5bGU9e3tcbiAgICAgICAgcGFkZGluZzogXCJ2YXIoLS1zLTMpIHZhcigtLXMtNClcIixcbiAgICAgICAgYmFja2dyb3VuZDogXCJ0cmFuc3BhcmVudFwiLFxuICAgICAgICBib3JkZXI6IFwiMXB4IHNvbGlkIHZhcigtLWFzaC1kZWVwKVwiLFxuICAgICAgICBib3JkZXJSYWRpdXM6IDAsXG4gICAgICB9fVxuICAgID5cbiAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLFxuICAgICAgICBmb250U2l6ZTogMTYsIGxpbmVIZWlnaHQ6IDEuNTUsIGNvbG9yOiBcInZhcigtLWJvbmUpXCIsXG4gICAgICAgIHRleHRXcmFwOiBcInByZXR0eVwiLFxuICAgICAgfX0+XG4gICAgICAgIFx1MDBBQiB7aW50ZW50aW9uLmludGVudGlvbl90ZXh0fSBcdTAwQkJcbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3cgbXQtc1wiIHN0eWxlPXt7XG4gICAgICAgIGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIiwgYWxpZ25JdGVtczogXCJjZW50ZXJcIiwgZmxleFdyYXA6IFwid3JhcFwiLCBnYXA6IDgsXG4gICAgICB9fT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZXRhLW1vbm9cIiBzdHlsZT17e1xuICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tbW9ubylcIiwgZm9udFNpemU6IDEwLCBsZXR0ZXJTcGFjaW5nOiBcIjAuMTJlbVwiLFxuICAgICAgICAgIGNvbG9yOiBcInZhcigtLWFzaC1saWdodClcIiwgdGV4dFRyYW5zZm9ybTogXCJ1cHBlcmNhc2VcIixcbiAgICAgICAgfX0+XG4gICAgICAgICAge19yZWxXaGVuKGludGVudGlvbi5jcmVhdGVkX2F0KX1cbiAgICAgICAgICB7dW50aWwgJiYgPHNwYW4+IFx1MDBCNyBqdXNxdSdhdSB7dW50aWx9PC9zcGFuPn1cbiAgICAgICAgICB7XCIgXHUwMEI3IFwifVxuICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcInZhcigtLXNpbGstZ29sZClcIiB9fT5cbiAgICAgICAgICAgIHtpbnRlbnRpb24udm90ZXNfY291bnQgfHwgMH0ge2ludGVudGlvbi52b3Rlc19jb3VudCA9PT0gMSA/IFwidm9peFwiIDogXCJ2b2l4XCJ9XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3cgZ2FwLXNcIj5cbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJidG4tdGV4dFwiXG4gICAgICAgICAgICBkaXNhYmxlZD17YnVzeX1cbiAgICAgICAgICAgIG9uQ2xpY2s9e29uVm90ZX1cbiAgICAgICAgICAgIHN0eWxlPXt7IGZvbnRTaXplOiAxMi41IH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgdGVuaXIgY2V0dGUgaW50ZW50aW9uXG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuLXRleHRcIlxuICAgICAgICAgICAgZGlzYWJsZWQ9e2J1c3l9XG4gICAgICAgICAgICBvbkNsaWNrPXtvbkFyY2hpdmV9XG4gICAgICAgICAgICBzdHlsZT17eyBmb250U2l6ZTogMTIuNSwgY29sb3I6IFwidmFyKC0tYXNoLWxpZ2h0KVwiIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgYXJjaGl2ZXJcbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbi8vIFx1MjUwMFx1MjUwMCBPbmdsZXQgOiBSaXR1ZWwgZGUgY2xcdTAwRjR0dXJlIChUMiBOaXZlYXUgMykgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vLyBBZmZpY2hcdTAwRTkgdW5pcXVlbWVudCBzaSBjaXJjbGUuY2xvc2VkX2F0IElTIE5PVCBOVUxMLlxuLy8gQ2hhcmdlIGxhIHJlc3RpdHV0aW9uIGZpbmFsZSB2aWEgL2FwaS9jaXJjbGVzL1tpZF0vcmVzdGl0dXRpb25zIGV0IHRyb3V2ZVxuLy8gY2VsbGUgbWFycXVcdTAwRTllIGlzX2Nsb3N1cmVfcmVzdGl0dXRpb24gPSB0cnVlIChvdSBsYSBwbHVzIHJcdTAwRTljZW50ZSBmYWxsYmFjaykuXG5jb25zdCBUYWJDbG90dXJlID0gKHsgY2lyY2xlLCBjaXJjbGVJZCB9KSA9PiB7XG4gIGNvbnN0IFtyZXN0aXR1dGlvbiwgc2V0UmVzdGl0dXRpb25dID0gdVNBUyhudWxsKTtcbiAgY29uc3QgW2xvYWRpbmcsIHNldExvYWRpbmddID0gdVNBUyh0cnVlKTtcbiAgY29uc3QgW2Vycm9yLCBzZXRFcnJvcl0gPSB1U0FTKG51bGwpO1xuXG4gIHVTQUUoKCkgPT4ge1xuICAgIGxldCBjYW5jZWxsZWQgPSBmYWxzZTtcbiAgICAoYXN5bmMgKCkgPT4ge1xuICAgICAgc2V0TG9hZGluZyh0cnVlKTtcbiAgICAgIHNldEVycm9yKG51bGwpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgciA9IGF3YWl0IF9hdXRoZWRGZXRjaChgL2FwaS9jaXJjbGVzLyR7ZW5jb2RlVVJJQ29tcG9uZW50KGNpcmNsZUlkKX0vcmVzdGl0dXRpb25zYCk7XG4gICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByLmpzb24oKTtcbiAgICAgICAgaWYgKGNhbmNlbGxlZCkgcmV0dXJuO1xuICAgICAgICBpZiAoIXIub2spIHtcbiAgICAgICAgICBzZXRFcnJvcihkYXRhPy5lcnJvciB8fCBcImxlY3R1cmUgZmluYWxlIGludHJvdXZhYmxlXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IGxpc3QgPSBkYXRhPy5yZXN0aXR1dGlvbnMgfHwgW107XG4gICAgICAgICAgLy8gVHJvdXZlIGxhIGNsb3N1cmUgcmVzdGl0dXRpb24gcHJpb3JpdGFpcmVtZW50XG4gICAgICAgICAgY29uc3QgY2xvc3VyZSA9IGxpc3QuZmluZCgoeCkgPT4geC5pc19jbG9zdXJlX3Jlc3RpdHV0aW9uIHx8IHguaWQgPT09IGNpcmNsZT8uY2xvc3VyZV9yZXN0aXR1dGlvbl9pZCk7XG4gICAgICAgICAgc2V0UmVzdGl0dXRpb24oY2xvc3VyZSB8fCBsaXN0WzBdIHx8IG51bGwpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmICghY2FuY2VsbGVkKSBzZXRFcnJvcihlPy5tZXNzYWdlIHx8IFwibGVjdHVyZSBmaW5hbGUgaW50cm91dmFibGVcIik7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBpZiAoIWNhbmNlbGxlZCkgc2V0TG9hZGluZyhmYWxzZSk7XG4gICAgICB9XG4gICAgfSkoKTtcbiAgICByZXR1cm4gKCkgPT4geyBjYW5jZWxsZWQgPSB0cnVlOyB9O1xuICB9LCBbY2lyY2xlSWQsIGNpcmNsZT8uY2xvc3VyZV9yZXN0aXR1dGlvbl9pZF0pO1xuXG4gIGNvbnN0IGFyY2hpdmVUb01lbW9yaWVzID0gYXN5bmMgKCkgPT4ge1xuICAgIC8vIFYxIDogb24gY29waWUgbGUgdGV4dGUgZGFucyBsYSBwcmVzc2UtcGFwaWVyIGNvbW1lIHByZW1pZXIgZ2VzdGUgZCdhcmNoaXZhZ2UgZG91eC5cbiAgICAvLyBWMiA6IGluc2VydGlvbiBkYW5zIHVuZSB0YWJsZSB1c2VyX2FyY2hpdmVkX3Jlc3RpdHV0aW9ucyBvdSBleHBvcnQgUERGLlxuICAgIGlmICghcmVzdGl0dXRpb24/Lm5hcnJhdGl2ZV90ZXh0KSByZXR1cm47XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IG5hdmlnYXRvci5jbGlwYm9hcmQ/LndyaXRlVGV4dChyZXN0aXR1dGlvbi5uYXJyYXRpdmVfdGV4dCk7XG4gICAgICBhbGVydChcImxhIGxlY3R1cmUgZmluYWxlIGVzdCBkYW5zIHRvbiBwcmVzc2UtcGFwaWVyIFx1MjAxNCBjb2xsZS1sYSBvXHUwMEY5IHR1IGdhcmRlcyB0ZXMgbVx1MDBFOW1vaXJlcy5cIik7XG4gICAgfSBjYXRjaCB7XG4gICAgICBhbGVydChcImNvcGllIG1hbnVlbGxlIG5cdTAwRTljZXNzYWlyZSBcdTIwMTQgc1x1MDBFOWxlY3Rpb25uZSBsZSB0ZXh0ZSBjaS1kZXNzdXMuXCIpO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwic3RhY2sgZ2FwLW1cIj5cbiAgICAgIDxwXG4gICAgICAgIGNsYXNzTmFtZT1cIm1ldGEgb3AtNzBcIlxuICAgICAgICBzdHlsZT17eyBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIG1heFdpZHRoOiA1NjAgfX1cbiAgICAgID5cbiAgICAgICAgY2UgY2VyY2xlIHMnZXN0IHJlZmVybVx1MDBFOS4gdHJvaXMgdm9peCB0cmVzc1x1MDBFOWVzIFx1MjAxNCBwYXBlciwgc3RvbmUsIHNpbGsgXHUyMDE0IHNvbnRcbiAgICAgICAgdmVudWVzIHBvc2VyIGNlIHF1aSBhIHRyYXZlcnNcdTAwRTkgcGVuZGFudCBjZXR0ZSB0cmF2ZXJzXHUwMEU5ZS4gbGEgdHJhbWUgcmVzdGUsXG4gICAgICAgIGFub255bWUgZXQgbnVlLCBkYW5zIHRlcyBtXHUwMEU5bW9pcmVzIHNpIHR1IHZldXguXG4gICAgICA8L3A+XG5cbiAgICAgIHtsb2FkaW5nICYmIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LWNlbnRlclwiIHN0eWxlPXt7IHBhZGRpbmc6IFwidmFyKC0tcy01KVwiIH19PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnJlYXRoXCIgc3R5bGU9e3sgbWFyZ2luOiBcIjAgYXV0b1wiIH19IC8+XG4gICAgICAgICAgPHAgY2xhc3NOYW1lPVwic2V1aWwtaXRhbGljIG10LW1cIiBzdHlsZT17eyBjb2xvcjogXCJ2YXIoLS1hc2gtbGlnaHQpXCIgfX0+XG4gICAgICAgICAgICBsYSBsZWN0dXJlIGZpbmFsZSBzZSBjaGFyZ2UuXG4gICAgICAgICAgPC9wPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG5cbiAgICAgIHshbG9hZGluZyAmJiBlcnJvciAmJiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWV0YVwiIHN0eWxlPXt7XG4gICAgICAgICAgY29sb3I6IFwidmFyKC0tZW1iZXItbGl2ZSlcIiwgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLFxuICAgICAgICB9fT5cbiAgICAgICAgICB7ZXJyb3J9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cblxuICAgICAgeyFsb2FkaW5nICYmIHJlc3RpdHV0aW9uICYmIChcbiAgICAgICAgPD5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJjYXJkXCJcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBhZGRpbmc6IFwidmFyKC0tcy01KSB2YXIoLS1zLTQpXCIsXG4gICAgICAgICAgICAgIGJhY2tncm91bmQ6IFwidmFyKC0tbmlnaHQtd2FybSlcIixcbiAgICAgICAgICAgICAgYm9yZGVyOiBcIjFweCBzb2xpZCBjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgMTQlLCB2YXIoLS1hc2gtZGVlcCkpXCIsXG4gICAgICAgICAgICAgIGJvcmRlclJhZGl1czogMCxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZXRhLW1vbm8gbWItbVwiIHN0eWxlPXt7XG4gICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tbW9ubylcIiwgZm9udFNpemU6IDEwLCBsZXR0ZXJTcGFjaW5nOiBcIjAuMTRlbVwiLFxuICAgICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1zaWxrLWdvbGQpXCIsIHRleHRUcmFuc2Zvcm06IFwidXBwZXJjYXNlXCIsXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgXHUyNzI2IGxlY3R1cmUgZmluYWxlIFx1MDBCNyB7X3JlbFdoZW4ocmVzdGl0dXRpb24ucmVxdWVzdGVkX2F0IHx8IHJlc3RpdHV0aW9uLmdlbmVyYXRlZF9hdCB8fCBjaXJjbGU/LmNsb3NlZF9hdCl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLCBmb250U2l6ZTogMTcsXG4gICAgICAgICAgICAgIGxpbmVIZWlnaHQ6IDEuNzUsIGNvbG9yOiBcInZhcigtLWJvbmUpXCIsIHRleHRXcmFwOiBcInByZXR0eVwiLFxuICAgICAgICAgICAgICB3aGl0ZVNwYWNlOiBcInByZS13cmFwXCIsXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAge3Jlc3RpdHV0aW9uLm5hcnJhdGl2ZV90ZXh0IHx8IFwiKGxhIGxlY3R1cmUgZmluYWxlIG4nYSBwYXMgcHUgXHUwMEVBdHJlIHRpc3NcdTAwRTllLilcIn1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3cgZ2FwLW0gbXQtc1wiIHN0eWxlPXt7IGZsZXhXcmFwOiBcIndyYXBcIiB9fT5cbiAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuLWdob3N0XCIgb25DbGljaz17YXJjaGl2ZVRvTWVtb3JpZXN9PlxuICAgICAgICAgICAgICBhcmNoaXZlciBkYW5zIG1lcyBtXHUwMEU5bW9pcmVzXG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC8+XG4gICAgICApfVxuXG4gICAgICB7IWxvYWRpbmcgJiYgIXJlc3RpdHV0aW9uICYmICFlcnJvciAmJiAoXG4gICAgICAgIDxwIGNsYXNzTmFtZT1cInNldWlsLWl0YWxpY1wiIHN0eWxlPXt7IGNvbG9yOiBcInZhcigtLWFzaC1saWdodClcIiB9fT5cbiAgICAgICAgICBhdWN1bmUgbGVjdHVyZSBmaW5hbGUgbidhIGVuY29yZSBcdTAwRTl0XHUwMEU5IHRpc3NcdTAwRTllIHBvdXIgY2UgY2VyY2xlLlxuICAgICAgICA8L3A+XG4gICAgICApfVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuLy8gXHUyNTAwXHUyNTAwIENlcmNsZVN1YkFwcCBcdTIwMTQgd3JhcHBlciBhdmVjIG5hdiA1IG9uZ2xldHMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5jb25zdCBDZXJjbGVTdWJBcHAgPSAoeyBnbywgY2lyY2xlSWQgfSkgPT4ge1xuICBjb25zdCBbdGFiLCBzZXRUYWJdID0gdVNBUygoKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IG0gPSAobG9jYXRpb24uaGFzaCB8fCBcIlwiKS5tYXRjaCgvWz8mXXRhYj0oW2Etei1dKykvKTtcbiAgICAgIHJldHVybiBtID8gbVsxXSA6IFwiZGVwb3RzXCI7XG4gICAgfSBjYXRjaCB7IHJldHVybiBcImRlcG90c1wiOyB9XG4gIH0pO1xuICBjb25zdCBbY2lyY2xlLCBzZXRDaXJjbGVdID0gdVNBUyhudWxsKTtcbiAgY29uc3QgW21lbWJlcnMsIHNldE1lbWJlcnNdID0gdVNBUyhbXSk7XG4gIGNvbnN0IFtsb2FkaW5nLCBzZXRMb2FkaW5nXSA9IHVTQVModHJ1ZSk7XG5cbiAgdVNBRSgoKSA9PiB7XG4gICAgbGV0IGNhbmNlbGxlZCA9IGZhbHNlO1xuICAgIGlmICghY2lyY2xlSWQpIHtcbiAgICAgIHNldExvYWRpbmcoZmFsc2UpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB3aW5kb3cuRHJlYW1BUEkubGlzdENpcmNsZXMoKVxuICAgICAgLnRoZW4oKGQpID0+IHtcbiAgICAgICAgaWYgKGNhbmNlbGxlZCkgcmV0dXJuO1xuICAgICAgICBjb25zdCBmb3VuZCA9IChkPy5jaXJjbGVzIHx8IFtdKS5maW5kKChjKSA9PiBjLmlkID09PSBjaXJjbGVJZCk7XG4gICAgICAgIHNldENpcmNsZShmb3VuZCB8fCBudWxsKTtcbiAgICAgICAgLy8gbWVtYmVycyBkYXRhIDogb24gYSBtZW1iZXJfY291bnQsIGV0IG9uIG4nYSBwYXMgZGUgbGlzdE1lbWJlcnMsIGRvbmMgZmFsbGJhY2sgY291bnQuXG4gICAgICAgIHNldExvYWRpbmcoZmFsc2UpO1xuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoKSA9PiB7IGlmICghY2FuY2VsbGVkKSBzZXRMb2FkaW5nKGZhbHNlKTsgfSk7XG4gICAgcmV0dXJuICgpID0+IHsgY2FuY2VsbGVkID0gdHJ1ZTsgfTtcbiAgfSwgW2NpcmNsZUlkXSk7XG5cbiAgaWYgKGxvYWRpbmcpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJzdGFnZVwiIHN0eWxlPXt7IGJhY2tncm91bmQ6IFwidmFyKC0tbmlnaHQtZmxvb3IpXCIgfX0+XG4gICAgICAgIDx3aW5kb3cuVG9wTmF2IHNob3dCYWNrIG9uQmFjaz17KCkgPT4gZ28oXCJjZXJjbGVcIil9IGxhYmVsPVwiXCIgLz5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmcmFtZSBjZW50ZXJcIiBzdHlsZT17eyBtaW5IZWlnaHQ6IFwiY2FsYygxMDB2aCAtIDYwcHgpXCIgfX0+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJicmVhdGhcIiAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICBpZiAoIWNpcmNsZSkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInN0YWdlIHNjcmVlbi1lbnRlclwiIHN0eWxlPXt7IGJhY2tncm91bmQ6IFwidmFyKC0tbmlnaHQtZmxvb3IpXCIgfX0+XG4gICAgICAgIDx3aW5kb3cuVG9wTmF2IHNob3dCYWNrIG9uQmFjaz17KCkgPT4gZ28oXCJjZXJjbGVcIil9IGxhYmVsPVwiXCIgLz5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmcmFtZSBjZW50ZXJcIiBzdHlsZT17eyBwYWRkaW5nVG9wOiBcInZhcigtLXMtNilcIiB9fT5cbiAgICAgICAgICA8cCBjbGFzc05hbWU9XCJzZXVpbC1pdGFsaWNcIiBzdHlsZT17eyBjb2xvcjogXCJ2YXIoLS1hc2gtbGlnaHQpXCIgfX0+XG4gICAgICAgICAgICBjZSBjZXJjbGUgbmUgdGUgdGllbnQgcGx1cywgb3UgbidleGlzdGUgcGFzLlxuICAgICAgICAgIDwvcD5cbiAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0bi10ZXh0IG10LWxcIiBvbkNsaWNrPXsoKSA9PiBnbyhcImNlcmNsZVwiKX0+XG4gICAgICAgICAgICBcdTIxOTAgcmV0b3VyIFx1MDBFMCB0ZXMgY2VyY2xlc1xuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICBjb25zdCBpc0VwaGVtZXJhbCA9ICEhY2lyY2xlPy5lcGhlbWVyYWxfdW50aWw7XG4gIGNvbnN0IGlzQ2xvc2VkID0gISFjaXJjbGU/LmNsb3NlZF9hdDtcbiAgY29uc3QgZXBoZW1lcmFsQ291bnRkb3duID0gdVNBTSgoKSA9PiB7XG4gICAgaWYgKCFpc0VwaGVtZXJhbCB8fCBpc0Nsb3NlZCkgcmV0dXJuIG51bGw7XG4gICAgY29uc3QgbXMgPSBuZXcgRGF0ZShjaXJjbGUuZXBoZW1lcmFsX3VudGlsKS5nZXRUaW1lKCkgLSBEYXRlLm5vdygpO1xuICAgIGlmIChtcyA8PSAwKSByZXR1cm4geyBkYXlzOiAwLCBob3VyczogMCwgbGFiZWw6IFwiY2UgY2VyY2xlIHNlIHJlZmVybWUgYXVqb3VyZCdodWlcIiB9O1xuICAgIGNvbnN0IGRheXMgPSBNYXRoLmZsb29yKG1zIC8gKDI0ICogMzYwMCAqIDEwMDApKTtcbiAgICBjb25zdCBob3VycyA9IE1hdGguZmxvb3IoKG1zICUgKDI0ICogMzYwMCAqIDEwMDApKSAvICgzNjAwICogMTAwMCkpO1xuICAgIGxldCBsYWJlbDtcbiAgICBpZiAoZGF5cyA+PSAyKSBsYWJlbCA9IGBjZSBjZXJjbGUgc2UgcmVmZXJtZSBkYW5zICR7ZGF5c30gam91cnNgO1xuICAgIGVsc2UgaWYgKGRheXMgPT09IDEpIGxhYmVsID0gXCJjZSBjZXJjbGUgc2UgcmVmZXJtZSBkZW1haW5cIjtcbiAgICBlbHNlIGxhYmVsID0gYGNlIGNlcmNsZSBzZSByZWZlcm1lIGRhbnMgJHtob3Vyc30gaGV1cmVzYDtcbiAgICByZXR1cm4geyBkYXlzLCBob3VycywgbGFiZWwgfTtcbiAgfSwgW2lzRXBoZW1lcmFsLCBpc0Nsb3NlZCwgY2lyY2xlPy5lcGhlbWVyYWxfdW50aWxdKTtcblxuICBjb25zdCBUQUJTID0gW1xuICAgIC4uLihpc0Nsb3NlZCA/IFtbXCJjbG9zdXJlXCIsIFwiXHUyNzI2IHJpdHVlbCBkZSBjbFx1MDBGNHR1cmVcIl1dIDogW10pLFxuICAgIFtcImRlcG90c1wiLCBcImRcdTAwRTlwXHUwMEY0dHNcIl0sXG4gICAgW1wiY2hhdFwiLCBcImNoYXRcIl0sXG4gICAgW1wic3luY2hyb25pY2l0ZXNcIiwgXCJzeW5jaHJvbmljaXRcdTAwRTlzXCJdLFxuICAgIFtcIm1ldGVvXCIsIFwibVx1MDBFOXRcdTAwRTlvXCJdLFxuICAgIFtcImFubmFsZXNcIiwgXCJhbm5hbGVzXCJdLFxuICAgIFtcInJpdHVlbHNcIiwgXCJyaXR1ZWxzXCJdLFxuICAgIFtcImludGVudGlvbnNcIiwgXCJpbnRlbnRpb25zXCJdLFxuICAgIFtcInBvcnRyYWl0XCIsIFwicG9ydHJhaXRcIl0sXG4gICAgW1wibWVtYnJlc1wiLCBcIm1lbWJyZXNcIl0sXG4gIF07XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInN0YWdlIHNjcmVlbi1lbnRlclwiIHN0eWxlPXt7IGJhY2tncm91bmQ6IFwidmFyKC0tbmlnaHQtZmxvb3IpXCIgfX0+XG4gICAgICA8d2luZG93LlRvcE5hdiBzaG93QmFjayBvbkJhY2s9eygpID0+IGdvKFwiY2VyY2xlXCIpfSBsYWJlbD1cIlwiIC8+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZyYW1lXCIgc3R5bGU9e3sgcG9zaXRpb246IFwicmVsYXRpdmVcIiB9fT5cbiAgICAgICAgey8qIEhlYWRlciBjZXJjbGUgKi99XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWV0YS1tb25vIG1iLXNcIiBzdHlsZT17e1xuICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tbW9ubylcIiwgZm9udFNpemU6IDEwLCBsZXR0ZXJTcGFjaW5nOiBcIjAuMTRlbVwiLFxuICAgICAgICAgIGNvbG9yOiBcInZhcigtLXNpbGstZ29sZClcIiwgdGV4dFRyYW5zZm9ybTogXCJ1cHBlcmNhc2VcIixcbiAgICAgICAgfX0+XG4gICAgICAgICAgY2VyY2xlIFx1MDBCNyB7Y2lyY2xlLnR5cGUgfHwgXCJzcG9udGFuZVwifVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGgxIGNsYXNzTmFtZT1cImgxLXNldWlsIG1iLWxcIj57Y2lyY2xlLm5hbWV9PC9oMT5cblxuICAgICAgICB7LyogRXBoZW1lcmFsIGNvdW50ZG93biBiYW5uZXIgKFQyIE5pdmVhdSAzKSAqL31cbiAgICAgICAge2VwaGVtZXJhbENvdW50ZG93biAmJiAhaXNDbG9zZWQgJiYgKFxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImNhcmQgbWItbFwiXG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBwYWRkaW5nOiBcInZhcigtLXMtMikgdmFyKC0tcy0zKVwiLFxuICAgICAgICAgICAgICBib3JkZXI6IFwiMXB4IHNvbGlkIGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSAyMiUsIHZhcigtLWFzaC1kZWVwKSlcIixcbiAgICAgICAgICAgICAgYmFja2dyb3VuZDogXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgNCUsIHRyYW5zcGFyZW50KVwiLFxuICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IDAsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLFxuICAgICAgICAgICAgICAgIGZvbnRTdHlsZTogXCJpdGFsaWNcIixcbiAgICAgICAgICAgICAgICBmb250U2l6ZTogMTQsXG4gICAgICAgICAgICAgICAgbGluZUhlaWdodDogMS42LFxuICAgICAgICAgICAgICAgIGNvbG9yOiBcInZhcigtLXNpbGstZ29sZClcIixcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgXHUyNzI2IHtlcGhlbWVyYWxDb3VudGRvd24ubGFiZWx9LlxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCJ2YXIoLS1hc2gtbGlnaHQpXCIsIG1hcmdpbkxlZnQ6IDggfX0+XG4gICAgICAgICAgICAgICAgYXUgam91ciBKLCB1bmUgbGVjdHVyZSBmaW5hbGUgc2VyYSB0aXNzXHUwMEU5ZS5cbiAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICl9XG5cbiAgICAgICAge2lzQ2xvc2VkICYmIChcbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJjYXJkIG1iLWxcIlxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcGFkZGluZzogXCJ2YXIoLS1zLTIpIHZhcigtLXMtMylcIixcbiAgICAgICAgICAgICAgYm9yZGVyOiBcIjFweCBzb2xpZCBjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgMjIlLCB2YXIoLS1hc2gtZGVlcCkpXCIsXG4gICAgICAgICAgICAgIGJhY2tncm91bmQ6IFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDQlLCB0cmFuc3BhcmVudClcIixcbiAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAwLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIixcbiAgICAgICAgICAgICAgICBmb250U3R5bGU6IFwiaXRhbGljXCIsXG4gICAgICAgICAgICAgICAgZm9udFNpemU6IDE0LFxuICAgICAgICAgICAgICAgIGxpbmVIZWlnaHQ6IDEuNixcbiAgICAgICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1zaWxrLWdvbGQpXCIsXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIFx1MjcyNiBjZSBjZXJjbGUgYSBcdTAwRTl0XHUwMEU5LiB7X3JlbFdoZW4oY2lyY2xlLmNsb3NlZF9hdCl9LCBpbCBzJ2VzdCByZWZlcm1cdTAwRTkgc3VyIGx1aS1tXHUwMEVBbWUuXG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKX1cblxuICAgICAgICB7LyogVGFicyBuYXYgKi99XG4gICAgICAgIDxkaXZcbiAgICAgICAgICBjbGFzc05hbWU9XCJyb3cgbWItbFwiXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIGdhcDogMCwgZmxleFdyYXA6IFwid3JhcFwiLFxuICAgICAgICAgICAgYm9yZGVyQm90dG9tOiBcIjFweCBzb2xpZCB2YXIoLS1hc2gtZGVlcClcIixcbiAgICAgICAgICAgIG1hcmdpbkJvdHRvbTogXCJ2YXIoLS1zLTUpXCIsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIHtUQUJTLm1hcCgoW2ssIGxhYmVsXSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgYWN0aXZlID0gdGFiID09PSBrO1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgIGtleT17a31cbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRUYWIoayl9XG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IFwidHJhbnNwYXJlbnRcIixcbiAgICAgICAgICAgICAgICAgIGJvcmRlcjogXCJub25lXCIsXG4gICAgICAgICAgICAgICAgICBib3JkZXJCb3R0b206IGFjdGl2ZVxuICAgICAgICAgICAgICAgICAgICA/IFwiMnB4IHNvbGlkIHZhcigtLXNpbGstZ29sZClcIlxuICAgICAgICAgICAgICAgICAgICA6IFwiMnB4IHNvbGlkIHRyYW5zcGFyZW50XCIsXG4gICAgICAgICAgICAgICAgICBwYWRkaW5nOiBcIjEwcHggMTZweFwiLFxuICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIixcbiAgICAgICAgICAgICAgICAgIGZvbnRTdHlsZTogXCJpdGFsaWNcIixcbiAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxNSxcbiAgICAgICAgICAgICAgICAgIGNvbG9yOiBhY3RpdmUgPyBcInZhcigtLXNpbGstZ29sZClcIiA6IFwidmFyKC0tYXNoLWxpZ2h0KVwiLFxuICAgICAgICAgICAgICAgICAgY3Vyc29yOiBcInBvaW50ZXJcIixcbiAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb246IFwiYWxsIDI4MG1zIGVhc2VcIixcbiAgICAgICAgICAgICAgICAgIG1hcmdpbkJvdHRvbTogLTEsXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHtsYWJlbH1cbiAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0pfVxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICB7LyogMjAyNi0wNC0yOSBcdTIwMTQgR2x5cGhlIHNhY3JcdTAwRTkgY29udGV4dHVlbCBwYXIgb25nbGV0IChZZXNodWEsIHNvYnJlIDI0eDI0KSAqL31cbiAgICAgICAge3dpbmRvdy5HZW9TeW1ib2wgJiYgKCgpID0+IHtcbiAgICAgICAgICBjb25zdCBnbHlwaEZvclRhYiA9IHtcbiAgICAgICAgICAgIHBvcnRyYWl0OiBcImNvbmNlbnRyaWNcIixcbiAgICAgICAgICAgIHJpdHVlbHM6IFwiY3JvaXNzYW50XCIsXG4gICAgICAgICAgICBjbG90dXJlOiBcInRyaWFuZ2xlXCIsXG4gICAgICAgICAgfTtcbiAgICAgICAgICBjb25zdCBraW5kID0gZ2x5cGhGb3JUYWJbdGFiXTtcbiAgICAgICAgICBpZiAoIWtpbmQpIHJldHVybiBudWxsO1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2IGFyaWEtaGlkZGVuPVwidHJ1ZVwiIHN0eWxlPXt7XG4gICAgICAgICAgICAgIGRpc3BsYXk6IFwiZmxleFwiLCBqdXN0aWZ5Q29udGVudDogXCJjZW50ZXJcIixcbiAgICAgICAgICAgICAgbWFyZ2luVG9wOiBcImNhbGMoLTEgKiB2YXIoLS1zLTMpKVwiLFxuICAgICAgICAgICAgICBtYXJnaW5Cb3R0b206IFwidmFyKC0tcy0zKVwiLFxuICAgICAgICAgICAgICBoZWlnaHQ6IDM2LCBwb3NpdGlvbjogXCJyZWxhdGl2ZVwiLFxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgcG9zaXRpb246IFwicmVsYXRpdmVcIiwgd2lkdGg6IDMyLCBoZWlnaHQ6IDMyLCBvcGFjaXR5OiAwLjU1IH19PlxuICAgICAgICAgICAgICAgIDx3aW5kb3cuR2VvU3ltYm9sIGtpbmQ9e2tpbmR9IGNvbG9yPVwic2lsa1wiXG4gICAgICAgICAgICAgICAgICBzdHlsZT17eyBwb3NpdGlvbjogXCJyZWxhdGl2ZVwiLCB3aWR0aDogMzIsIGhlaWdodDogMzIsIG9wYWNpdHk6IDEgfX0gLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApO1xuICAgICAgICB9KSgpfVxuXG4gICAgICAgIHsvKiAyMDI2LTA0LTI5IFx1MjAxNCBTeW5jaHJvbmljaXRcdTAwRTlzIDogc29uZ2xpbmVzIGVuIGJhY2tncm91bmQgZGlzY3JldCAoWWVzaHVhLCBvcGFjaXR5IDAuMSkgKi99XG4gICAgICAgIHt0YWIgPT09IFwic3luY2hyb25pY2l0ZXNcIiAmJiB3aW5kb3cuR2VvU3ltYm9sICYmIChcbiAgICAgICAgICA8ZGl2IGFyaWEtaGlkZGVuPVwidHJ1ZVwiIHN0eWxlPXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogXCJhYnNvbHV0ZVwiLCBpbnNldDogMCxcbiAgICAgICAgICAgIG9wYWNpdHk6IDAuMTAsIHBvaW50ZXJFdmVudHM6IFwibm9uZVwiLCB6SW5kZXg6IDAsXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgICA8d2luZG93Lkdlb1N5bWJvbCBraW5kPVwic29uZ2xpbmVzXCIgY29sb3I9XCJzaWxrXCJcbiAgICAgICAgICAgICAgc3R5bGU9e3sgcG9zaXRpb246IFwiYWJzb2x1dGVcIiwgaW5zZXQ6IDAsIHdpZHRoOiBcIjEwMCVcIiwgaGVpZ2h0OiBcIjEwMCVcIiwgb3BhY2l0eTogMSB9fSAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApfVxuXG4gICAgICAgIHsvKiBDb250ZW51IGRlIGwnb25nbGV0IGFjdGlmICovfVxuICAgICAgICA8ZGl2IHN0eWxlPXt7IHBvc2l0aW9uOiBcInJlbGF0aXZlXCIsIHpJbmRleDogMSB9fT5cbiAgICAgICAge3RhYiA9PT0gXCJtZW1icmVzXCIgJiYgPFRhYk1lbWJyZXMgY2lyY2xlPXtjaXJjbGV9IG1lbWJlcnM9e21lbWJlcnN9IGNpcmNsZUlkPXtjaXJjbGVJZH0gLz59XG4gICAgICAgIHt0YWIgPT09IFwiY2xvc3VyZVwiICYmIDxUYWJDbG90dXJlIGNpcmNsZT17Y2lyY2xlfSBjaXJjbGVJZD17Y2lyY2xlSWR9IC8+fVxuICAgICAgICB7dGFiID09PSBcImRlcG90c1wiICYmIDxUYWJEZXBvdHMgY2lyY2xlPXtjaXJjbGV9IGNpcmNsZUlkPXtjaXJjbGVJZH0gZ289e2dvfSAvPn1cbiAgICAgICAge3RhYiA9PT0gXCJjaGF0XCIgJiYgPFRhYkNoYXQgY2lyY2xlSWQ9e2NpcmNsZUlkfSAvPn1cbiAgICAgICAge3RhYiA9PT0gXCJwb3J0cmFpdFwiICYmIDxUYWJQb3J0cmFpdCBjaXJjbGVJZD17Y2lyY2xlSWR9IC8+fVxuICAgICAgICB7dGFiID09PSBcImludGVudGlvbnNcIiAmJiA8VGFiSW50ZW50aW9ucyBjaXJjbGVJZD17Y2lyY2xlSWR9IC8+fVxuICAgICAgICB7dGFiID09PSBcInN5bmNocm9uaWNpdGVzXCIgJiYgKHdpbmRvdy5UYWJTeW5jaHJvbmljaXRlc1xuICAgICAgICAgID8gPHdpbmRvdy5UYWJTeW5jaHJvbmljaXRlcyBjaXJjbGVJZD17Y2lyY2xlSWR9IC8+XG4gICAgICAgICAgOiA8ZGl2IGNsYXNzTmFtZT1cIm1ldGEgb3AtNzBcIj5tb2R1bGUgc3luY2hyb25pY2l0XHUwMEU5cyBub24gY2hhcmdcdTAwRTkuPC9kaXY+KX1cbiAgICAgICAge3RhYiA9PT0gXCJtZXRlb1wiICYmICh3aW5kb3cuVGFiTWV0ZW9cbiAgICAgICAgICA/IDx3aW5kb3cuVGFiTWV0ZW8gY2lyY2xlSWQ9e2NpcmNsZUlkfSAvPlxuICAgICAgICAgIDogPGRpdiBjbGFzc05hbWU9XCJtZXRhIG9wLTcwXCI+bW9kdWxlIG1cdTAwRTl0XHUwMEU5byBub24gY2hhcmdcdTAwRTkuPC9kaXY+KX1cbiAgICAgICAge3RhYiA9PT0gXCJhbm5hbGVzXCIgJiYgKHdpbmRvdy5UYWJBbm5hbGVzXG4gICAgICAgICAgPyA8d2luZG93LlRhYkFubmFsZXMgY2lyY2xlSWQ9e2NpcmNsZUlkfSAvPlxuICAgICAgICAgIDogPGRpdiBjbGFzc05hbWU9XCJtZXRhIG9wLTcwXCI+bW9kdWxlIGFubmFsZXMgbm9uIGNoYXJnXHUwMEU5LjwvZGl2Pil9XG4gICAgICAgIHt0YWIgPT09IFwicml0dWVsc1wiICYmICh3aW5kb3cuVGFiUml0dWVsc1xuICAgICAgICAgID8gPHdpbmRvdy5UYWJSaXR1ZWxzIGNpcmNsZUlkPXtjaXJjbGVJZH0gLz5cbiAgICAgICAgICA6IDxkaXYgY2xhc3NOYW1lPVwibWV0YSBvcC03MFwiPm1vZHVsZSByaXR1ZWxzIG5vbiBjaGFyZ1x1MDBFOS48L2Rpdj4pfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAge3dpbmRvdy5GZWVkYmFja0Zsb2F0ICYmIDx3aW5kb3cuRmVlZGJhY2tGbG9hdCAvPn1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbk9iamVjdC5hc3NpZ24od2luZG93LCB7IENlcmNsZVN1YkFwcCB9KTtcbiJdLAogICJtYXBwaW5ncyI6ICJBQW9CQSxNQUFNLEVBQUUsVUFBVSxNQUFNLFdBQVcsTUFBTSxTQUFTLE1BQU0sUUFBUSxNQUFNLGFBQWEsS0FBSyxJQUFJO0FBRzVGLFNBQVMsU0FBUyxLQUFLO0FBdkJ2QjtBQXdCRSxNQUFJLENBQUMsSUFBSyxRQUFPO0FBQ2pCLE1BQUk7QUFDRixhQUFPLGtCQUFPLGFBQVAsbUJBQWlCLGtCQUFqQiw0QkFBaUMsU0FBUTtBQUFBLEVBQ2xELFNBQVE7QUFDTixXQUFPO0FBQUEsRUFDVDtBQUNGO0FBRUEsU0FBUyxPQUFPLEtBQUs7QUFDbkIsUUFBTSxJQUFJLENBQUMs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
