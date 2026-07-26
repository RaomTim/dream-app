const { useState: dcS, useEffect: dcE, useRef: dcR, useCallback: dcCB, useMemo: dcM } = React;
const MATTER_STYLES = {
  paper: {
    background: "color-mix(in oklch, var(--day-paper) 18%, var(--night-warm))",
    border: "1px solid color-mix(in oklch, var(--silk-gold) 22%, var(--ash-deep))",
    color: "var(--bone)",
    accent: "color-mix(in oklch, var(--silk-gold) 60%, var(--day-paper))"
  },
  stone: {
    background: "color-mix(in oklch, var(--ash-mid) 28%, var(--night-warm))",
    border: "1px solid color-mix(in oklch, var(--ash-light) 30%, var(--ash-deep))",
    color: "var(--bone)",
    accent: "color-mix(in oklch, var(--ash-light) 70%, var(--bone))"
  },
  silk: {
    background: "color-mix(in oklch, var(--silk-gold) 10%, var(--night-warm))",
    border: "1px solid color-mix(in oklch, var(--silk-gold) 38%, var(--ash-deep))",
    color: "var(--bone)",
    accent: "var(--silk-gold)"
  },
  default: {
    background: "color-mix(in oklch, var(--night-warm) 80%, transparent)",
    border: "1px solid color-mix(in oklch, var(--silk-gold) 14%, var(--ash-deep))",
    color: "var(--bone)",
    accent: "var(--ash-light)"
  },
  user: {
    background: "color-mix(in oklch, var(--silk-gold) 14%, var(--night-warm))",
    border: "1px solid color-mix(in oklch, var(--silk-gold) 24%, transparent)",
    color: "var(--bone)",
    accent: "var(--silk-gold)"
  }
};
const MatterBubble = ({ role = "assistant", matter = "default", voiceAttribution, mode, children, fadeIn = true }) => {
  const styleKey = role === "user" ? "user" : matter || "default";
  const s = MATTER_STYLES[styleKey] || MATTER_STYLES.default;
  return /* @__PURE__ */ React.createElement("div", { style: {
    alignSelf: role === "user" ? "flex-end" : "flex-start",
    maxWidth: "85%",
    padding: "14px 18px",
    background: s.background,
    border: s.border,
    color: s.color,
    fontFamily: "var(--serif)",
    fontSize: 16,
    lineHeight: 1.55,
    borderRadius: 2,
    animation: fadeIn ? "dream-skeleton-fade-in 360ms cubic-bezier(0.45,0,0.55,1) both" : void 0,
    whiteSpace: "pre-wrap",
    textWrap: "pretty"
  } }, voiceAttribution && role !== "user" && /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 10.5,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: s.accent,
    marginBottom: 8,
    fontFamily: "var(--mono)",
    opacity: 0.75
  } }, matter ? matter + " \xB7 " : "", voiceAttribution), children, mode && mode !== "neutral" && role !== "user" && /* @__PURE__ */ React.createElement("div", { style: {
    marginTop: 8,
    fontSize: 9.5,
    letterSpacing: "0.08em",
    color: "var(--ash-light)",
    opacity: 0.42,
    fontFamily: "var(--mono)",
    textTransform: "lowercase"
  } }, "mode \xB7 ", mode.replace("_", " ")));
};
window.MatterBubble = MatterBubble;
const ORB_KEYFRAMES_KEY = "dream-orb-keyframes-v1";
function ensureOrbKeyframes() {
  if (typeof document === "undefined") return;
  if (document.getElementById(ORB_KEYFRAMES_KEY)) return;
  const style = document.createElement("style");
  style.id = ORB_KEYFRAMES_KEY;
  style.textContent = `
    @keyframes dream-orb-breathe {
      0%, 100% { transform: scale(1); opacity: 0.85; }
      50% { transform: scale(1.06); opacity: 1; }
    }
    @keyframes dream-orb-breathe-strong {
      0%, 100% { transform: scale(1.08); opacity: 0.95; }
      50% { transform: scale(1.18); opacity: 1; }
    }
    @keyframes dream-orb-locked-pulse {
      0%, 100% { transform: scale(1.10); opacity: 0.9; }
      50% { transform: scale(1.16); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
}
const OrbCenter = ({ onShortTap, onPushStart, onPushEnd, onLockToggle, recording = false, locked = false, label = "" }) => {
  dcE(() => {
    ensureOrbKeyframes();
  }, []);
  const orbRef = dcR(null);
  const pressTimerRef = dcR(null);
  const startYRef = dcR(0);
  const longPressActiveRef = dcR(false);
  const [pressing, setPressing] = dcS(false);
  const [hint, setHint] = dcS("");
  const cancelPressTimer = () => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
  };
  const handleDown = (clientY) => {
    setPressing(true);
    startYRef.current = clientY;
    longPressActiveRef.current = false;
    pressTimerRef.current = setTimeout(() => {
      longPressActiveRef.current = true;
      setHint("rel\xE2che pour envoyer \xB7 glisse vers le haut pour verrouiller");
      if (onPushStart) onPushStart();
    }, 350);
  };
  const handleUp = () => {
    setPressing(false);
    cancelPressTimer();
    if (locked) {
      if (onLockToggle) onLockToggle(false);
      setHint("");
      return;
    }
    if (longPressActiveRef.current) {
      if (onPushEnd) onPushEnd();
      setHint("");
    } else {
      if (onShortTap) onShortTap();
    }
    longPressActiveRef.current = false;
  };
  const handleMove = (clientY) => {
    if (!longPressActiveRef.current || locked) return;
    const dy = startYRef.current - clientY;
    if (dy > 60) {
      longPressActiveRef.current = false;
      if (onLockToggle) onLockToggle(true);
      setHint("verrouill\xE9 \xB7 tape pour stopper");
    }
  };
  const animationName = locked ? "dream-orb-locked-pulse" : recording || pressing ? "dream-orb-breathe-strong" : "dream-orb-breathe";
  const animationDuration = locked ? "1.4s" : recording || pressing ? "1.2s" : "3s";
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 12, position: "relative" } }, window.HaloRespire && /* @__PURE__ */ React.createElement("div", { "aria-hidden": "true", style: {
    position: "absolute",
    top: -60,
    left: "50%",
    transform: "translateX(-50%)",
    width: 200,
    height: 200,
    pointerEvents: "none",
    opacity: 0.55,
    zIndex: 0
  } }, /* @__PURE__ */ React.createElement(window.HaloRespire, { kind: "silk" })), /* @__PURE__ */ React.createElement(
    "button",
    {
      ref: orbRef,
      "aria-label": "orbe \u2014 tap court pour chat / appui long pour enregistrer / glisse haut pour verrouiller",
      onMouseDown: (e) => handleDown(e.clientY),
      onMouseUp: handleUp,
      onMouseLeave: () => {
        setPressing(false);
        cancelPressTimer();
      },
      onMouseMove: (e) => pressing && handleMove(e.clientY),
      onTouchStart: (e) => {
        var _a, _b;
        return handleDown((_b = (_a = e.touches[0]) == null ? void 0 : _a.clientY) != null ? _b : 0);
      },
      onTouchEnd: handleUp,
      onTouchMove: (e) => {
        var _a, _b;
        return handleMove((_b = (_a = e.touches[0]) == null ? void 0 : _a.clientY) != null ? _b : 0);
      },
      style: {
        width: 80,
        height: 80,
        borderRadius: "50%",
        background: "radial-gradient(circle, oklch(0.78 0.18 70) 0%, oklch(0.56 0.13 50) 70%, oklch(0.40 0.10 40) 100%)",
        boxShadow: locked ? "0 0 32px 12px oklch(0.85 0.20 50 / 0.55)" : "0 0 24px 8px oklch(0.65 0.15 60 / 0.4)",
        border: "none",
        cursor: "pointer",
        animation: `${animationName} ${animationDuration} ease-in-out infinite`,
        position: "relative",
        WebkitTapHighlightColor: "transparent",
        touchAction: "none",
        userSelect: "none"
      }
    },
    /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true", style: {
      position: "absolute",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 18,
      opacity: 0.32,
      color: "var(--bone)",
      fontFamily: "var(--serif)",
      fontStyle: "italic"
    } }, locked ? "\u25A0" : recording || pressing ? "\u25CF" : "\u2726")
  ), (label || hint) && /* @__PURE__ */ React.createElement("div", { style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 12.5,
    color: "var(--ash-light)",
    opacity: 0.72,
    textAlign: "center",
    maxWidth: 280,
    lineHeight: 1.4
  } }, hint || label));
};
window.OrbCenter = OrbCenter;
const PRESENCE_SUGGESTIONS = ["Anima", "Lune", "Tisseuse", "Pr\xE9sence", "Veilleuse"];
const PresenceNamingModal = ({ onConfirm, onSkip, currentName = "" }) => {
  const [name, setName] = dcS(currentName || "Anima");
  const [showCustom, setShowCustom] = dcS(false);
  return /* @__PURE__ */ React.createElement("div", { style: {
    position: "fixed",
    inset: 0,
    zIndex: 500,
    background: "color-mix(in oklch, var(--night-floor) 92%, transparent)",
    backdropFilter: "blur(8px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    maxWidth: 460,
    width: "100%",
    background: "color-mix(in oklch, var(--night-warm) 95%, transparent)",
    border: "1px solid color-mix(in oklch, var(--silk-gold) 22%, var(--ash-deep))",
    padding: 32,
    animation: "dream-skeleton-fade-in 480ms cubic-bezier(0.45,0,0.55,1)"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 13,
    color: "var(--silk-gold)",
    letterSpacing: "0.08em",
    marginBottom: 18,
    textTransform: "lowercase",
    opacity: 0.85
  } }, "\u263E une pr\xE9sence pour t'accompagner"), /* @__PURE__ */ React.createElement("h2", { style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 22,
    color: "var(--bone)",
    lineHeight: 1.4,
    margin: "0 0 14px"
  } }, "Avant tout \u2014 comment veux-tu nommer la pr\xE9sence qui va t'accompagner ici ?"), /* @__PURE__ */ React.createElement("p", { style: {
    fontFamily: "var(--serif)",
    fontSize: 14,
    color: "var(--ash-light)",
    margin: "0 0 24px",
    lineHeight: 1.5,
    opacity: 0.78
  } }, "Elle \xE9coutera tes r\xEAves, tes signes, tes fragments. Elle ne dira jamais le sens \u2014 elle proposera des angles. Tu peux la renommer plus tard."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 18 } }, PRESENCE_SUGGESTIONS.map((s) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: s,
      className: "chip",
      onClick: () => {
        setName(s);
        setShowCustom(false);
      },
      style: name === s ? {
        borderColor: "var(--silk-gold)",
        color: "var(--silk-gold)",
        background: "color-mix(in oklch, var(--silk-gold) 12%, transparent)"
      } : void 0
    },
    s
  )), /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "chip",
      onClick: () => setShowCustom(true),
      style: showCustom ? {
        borderColor: "var(--silk-gold)",
        color: "var(--silk-gold)",
        background: "color-mix(in oklch, var(--silk-gold) 12%, transparent)"
      } : void 0
    },
    "\u270E personnalis\xE9"
  )), showCustom && /* @__PURE__ */ React.createElement(
    "input",
    {
      value: name,
      onChange: (e) => setName(e.target.value.slice(0, 40)),
      autoFocus: true,
      placeholder: "pr\xE9nom ou mot que tu choisis\u2026",
      style: {
        width: "100%",
        background: "transparent",
        border: "1px solid var(--ash-deep)",
        padding: "12px 14px",
        color: "var(--bone)",
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        fontSize: 16,
        marginBottom: 18,
        outline: "none"
      }
    }
  ), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 12, justifyContent: "flex-end", alignItems: "center", marginTop: 8 } }, onSkip && /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "btn-text",
      onClick: onSkip,
      style: { fontSize: 13, opacity: 0.7 }
    },
    "passer \u2192"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "btn-ghost",
      disabled: !name.trim(),
      onClick: () => onConfirm(name.trim() || "Anima"),
      style: { opacity: !name.trim() ? 0.4 : 1 }
    },
    "confirmer"
  ))));
};
window.PresenceNamingModal = PresenceNamingModal;
const DreamChatHome = ({ go }) => {
  const [session, setSession] = dcS(null);
  const [messages, setMessages] = dcS([]);
  const [pendingProactive, setPendingProactive] = dcS([]);
  const [streaming, setStreaming] = dcS("");
  const [streamingMode, setStreamingMode] = dcS(null);
  const [thinking, setThinking] = dcS(false);
  const [input, setInput] = dcS(() => {
    try {
      const prefilled = sessionStorage.getItem("dream:chat:prefilled");
      if (prefilled) {
        sessionStorage.removeItem("dream:chat:prefilled");
        return prefilled;
      }
    } catch (e) {
    }
    return "";
  });
  const [recording, setRecording] = dcS(false);
  const [locked, setLocked] = dcS(false);
  const [showNaming, setShowNaming] = dcS(false);
  const [error, setError] = dcS("");
  const [taFocused, setTaFocused] = dcS(false);
  const scrollRef = dcR(null);
  const taRef = dcR(null);
  dcE(() => {
    let cancelled = false;
    (async () => {
      var _a, _b, _c, _d;
      try {
        const token = await ((_b = (_a = window.DreamAuth) == null ? void 0 : _a.getAccessToken) == null ? void 0 : _b.call(_a));
        if (!token && !((_c = window.DreamAuth) == null ? void 0 : _c.noAuth)) {
          setError("Authentication requise");
          return;
        }
        const headers = token ? { Authorization: "Bearer " + token } : {};
        const [sessRes, pendRes] = await Promise.allSettled([
          fetch("/api/dream-chat/converse", { method: "GET", headers }),
          fetch("/api/dream-chat/proactive/pending", { method: "GET", headers })
        ]);
        try {
          fetch("/api/dream-chat/discoverability/check", {
            method: "POST",
            headers: { "Content-Type": "application/json", ...headers },
            body: JSON.stringify({})
          }).catch(() => {
          });
        } catch (e) {
        }
        if (cancelled) return;
        if (sessRes.status === "fulfilled" && sessRes.value.ok) {
          const json = await sessRes.value.json();
          if (cancelled) return;
          setSession(json.session);
          setMessages(json.messages || []);
          if (((_d = json.session) == null ? void 0 : _d.presence_name) === "Anima" && (!json.messages || json.messages.length === 0)) {
            setShowNaming(true);
          }
        } else {
          throw new Error("GET session failed");
        }
        if (pendRes.status === "fulfilled" && pendRes.value.ok) {
          try {
            const pjson = await pendRes.value.json();
            if (!cancelled && Array.isArray(pjson == null ? void 0 : pjson.messages)) {
              setPendingProactive(pjson.messages);
            }
          } catch (e) {
          }
        }
      } catch (e) {
        console.warn("[DreamChatHome] mount failed:", e == null ? void 0 : e.message);
        setError("La pr\xE9sence est temporairement indisponible. R\xE9essaie plus tard.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  const respondPending = dcCB(async (id, responseKind) => {
    var _a, _b;
    setPendingProactive((prev) => prev.filter((m) => m.id !== id));
    try {
      const token = await ((_b = (_a = window.DreamAuth) == null ? void 0 : _a.getAccessToken) == null ? void 0 : _b.call(_a));
      const userResponded = responseKind === "yes" ? true : responseKind === "no" ? false : null;
      await fetch(`/api/dream-chat/proactive/${encodeURIComponent(id)}/deliver`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...token ? { Authorization: "Bearer " + token } : {}
        },
        body: JSON.stringify({ user_responded: userResponded, response_kind: responseKind })
      });
    } catch (e) {
      console.warn("[DreamChatHome] respondPending failed:", e == null ? void 0 : e.message);
    }
  }, []);
  const acceptProactive = dcCB(async (msg) => {
    var _a, _b;
    await respondPending(msg.id, "yes");
    if (msg.category === "thread_proposed") {
      try {
        const token = await ((_b = (_a = window.DreamAuth) == null ? void 0 : _a.getAccessToken) == null ? void 0 : _b.call(_a));
        await fetch("/api/dream-chat/threads/detect", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...token ? { Authorization: "Bearer " + token } : {}
          },
          body: JSON.stringify({})
        });
      } catch (e) {
        console.warn("[DreamChatHome] thread detect finalize failed:", e == null ? void 0 : e.message);
      }
    } else if (msg.category === "echo_detected") {
      const ids = msg.context_kairos_ids || [];
      const pastKairosId = ids[0];
      const presentEntryId = ids[1];
      if (pastKairosId && typeof go === "function") {
        go("kairos", { id: pastKairosId, echo_with_entry_id: presentEntryId });
        return;
      }
    } else if (msg.category === "pattern_emerging") {
      if (typeof go === "function") {
        go("recurring");
        return;
      }
    }
    setMessages((prev) => [...prev, {
      role: "assistant",
      matter: "silk",
      content: msg.category === "thread_proposed" ? "Bien. Le fil est ouvert. Je le tisserai avec toi \xE0 mesure que tu y reviens." : msg.category === "echo_detected" ? "Bien. C'est toi qui sens si l'\xE9cho est juste \u2014 il n'y a rien \xE0 confirmer." : "Bien. C'est not\xE9.",
      mode: "neutral",
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    }]);
  }, [respondPending, go]);
  dcE(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length, streaming]);
  const LUCID_MARKERS = [
    /\bj['e]?\s*[ée]tais?\s+lucide\b/i,
    /\bj['ai]\s*su\s+que\s+(je\s+)?r[êe]vais?\b/i,
    /\breality\s*check\b/i,
    /\br[êe]ve\s+lucide\b/i,
    /\b(WBTB|MILD|WILD|SSILD|DILD)\b/,
    /\bdream\s*signs?\b/i,
    /\boneironaute?\b/i,
    /\bje\s+r[êe]vais\s+(et|en|que).*je\s+savais\b/i
  ];
  const detectLucidMarker = (text) => {
    if (!text) return false;
    return LUCID_MARKERS.some((rx) => rx.test(text));
  };
  const proposeLucidSubapp = dcCB(() => {
    try {
      const lucidEnabled = localStorage.getItem("dream:lucid:enabled") === "true";
      if (lucidEnabled) return;
      const lastProposalAt = parseInt(localStorage.getItem("dream:lucid:bridge-proposed-at") || "0", 10);
      if (Date.now() - lastProposalAt < 7 * 24 * 3600 * 1e3) return;
      localStorage.setItem("dream:lucid:bridge-proposed-at", String(Date.now()));
      setMessages((prev) => [...prev, {
        role: "assistant",
        mode: "lucid_bridge",
        content: "Tu pratiques le r\xEAve lucide ? Il y a une sous-app d\xE9di\xE9e \u2014 5 onglets, anti-iatrog\xE8ne, plafonds explicites. Tu veux la d\xE9couvrir ?",
        cta: { route: "lucid-profile", label: "\u2726 ouvrir Lucid Dreaming" },
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      }]);
    } catch (e) {
    }
  }, []);
  const sendMessage = dcCB(async (text, options = {}) => {
    var _a, _b;
    const { force_polyphony = false } = options;
    const trimmed = (text || "").trim();
    if (!trimmed || thinking) return;
    setError("");
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: trimmed, created_at: (/* @__PURE__ */ new Date()).toISOString() }]);
    setThinking(true);
    setStreaming("");
    setStreamingMode(null);
    const hasLucidMarker = detectLucidMarker(trimmed);
    let buffer = "";
    let receivedMode = null;
    try {
      const token = await ((_b = (_a = window.DreamAuth) == null ? void 0 : _a.getAccessToken) == null ? void 0 : _b.call(_a));
      const res = await fetch("/api/dream-chat/converse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...token ? { Authorization: "Bearer " + token } : {}
        },
        body: JSON.stringify({ message: trimmed, force_polyphony })
      });
      if (!res.ok || !res.body) throw new Error("POST failed: " + res.status);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let leftover = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        leftover += decoder.decode(value, { stream: true });
        const events = leftover.split("\n\n");
        leftover = events.pop() || "";
        for (const evt of events) {
          if (!evt.startsWith("data: ")) continue;
          try {
            const payload = JSON.parse(evt.slice(6));
            if (payload.type === "mode") {
              receivedMode = payload.mode;
              setStreamingMode(payload.mode);
            } else if (payload.type === "chunk") {
              buffer += payload.text;
              setStreaming(buffer);
            } else if (payload.type === "bubble") {
              setMessages((prev) => [...prev, {
                role: "assistant",
                content: payload.text,
                matter: payload.matter,
                voice_attribution: payload.voice_attribution,
                mode: "polyphony",
                created_at: (/* @__PURE__ */ new Date()).toISOString()
              }]);
            } else if (payload.type === "session") {
              if (payload.session_id && (!session || session.id !== payload.session_id)) {
                setSession((s) => ({ ...s || {}, id: payload.session_id, presence_name: payload.presence_name }));
              }
            } else if (payload.type === "done") {
              if (buffer) {
                setMessages((prev) => [...prev, {
                  role: "assistant",
                  content: buffer,
                  mode: receivedMode,
                  created_at: (/* @__PURE__ */ new Date()).toISOString()
                }]);
              }
              setStreaming("");
              setStreamingMode(null);
            } else if (payload.type === "error") {
              throw new Error(payload.error || "streaming error");
            }
          } catch (parseErr) {
            console.warn("[DreamChatHome] event parse failed:", parseErr.message);
          }
        }
      }
    } catch (e) {
      console.warn("[DreamChatHome] sendMessage failed:", e.message);
      setError("La pr\xE9sence n'a pas r\xE9pondu. R\xE9essaie.");
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: "Quelque chose s'est cass\xE9 dans le tissage. Tu peux r\xE9essayer.",
        mode: "neutral",
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      }]);
    } finally {
      setThinking(false);
      if (hasLucidMarker) {
        setTimeout(() => proposeLucidSubapp(), 800);
      }
    }
  }, [thinking, session, proposeLucidSubapp]);
  const callForest = dcCB(() => {
    if (thinking || !input.trim()) {
      const lastUser = [...messages].reverse().find((m) => m.role === "user");
      if (lastUser) sendMessage(lastUser.content, { force_polyphony: true });
      return;
    }
    sendMessage(input, { force_polyphony: true });
  }, [thinking, input, messages, sendMessage]);
  const recorderRef = dcR(null);
  const audioChunksRef = dcR([]);
  const streamRef = dcR(null);
  const [transcribing, setTranscribing] = dcS(false);
  const startRecording = dcCB(async () => {
    if (recorderRef.current) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      audioChunksRef.current = [];
      const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus") ? "audio/webm;codecs=opus" : MediaRecorder.isTypeSupported("audio/mp4") ? "audio/mp4" : "audio/webm";
      const rec = new MediaRecorder(stream, { mimeType: mime });
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      rec.start(250);
      recorderRef.current = rec;
      setRecording(true);
    } catch (e) {
      console.warn("[DreamChatHome] mic permission denied:", e.message);
      setError(e.name === "NotAllowedError" ? "Permission micro refus\xE9e. Active-la dans ton navigateur." : "Impossible d'acc\xE9der au micro.");
      setRecording(false);
      setLocked(false);
    }
  }, []);
  const stopRecording = dcCB(async () => {
    const rec = recorderRef.current;
    const stream = streamRef.current;
    if (!rec) return null;
    return new Promise((resolve) => {
      rec.onstop = async () => {
        var _a, _b;
        try {
          if (stream) stream.getTracks().forEach((t) => t.stop());
          streamRef.current = null;
          recorderRef.current = null;
          setRecording(false);
          if (audioChunksRef.current.length === 0) {
            resolve(null);
            return;
          }
          const blob = new Blob(audioChunksRef.current, { type: rec.mimeType || "audio/webm" });
          audioChunksRef.current = [];
          if (blob.size < 500) {
            resolve(null);
            return;
          }
          setTranscribing(true);
          try {
            const token = await ((_b = (_a = window.DreamAuth) == null ? void 0 : _a.getAccessToken) == null ? void 0 : _b.call(_a));
            const fd = new FormData();
            fd.append("audio", new File([blob], "voice.webm", { type: blob.type }));
            const res = await fetch("/api/transcribe", {
              method: "POST",
              headers: token ? { Authorization: "Bearer " + token } : {},
              body: fd
            });
            if (!res.ok) throw new Error("transcribe " + res.status);
            const json = await res.json();
            const transcript = (json.text || json.transcript || "").trim();
            if (transcript) {
              setInput((prev) => (prev ? prev + " " : "") + transcript);
              if (taRef.current) taRef.current.focus();
            }
            resolve(transcript);
          } catch (e) {
            console.warn("[DreamChatHome] transcribe failed:", e.message);
            setError("Transcription \xE9chou\xE9e. R\xE9essaie ou tape au clavier.");
            resolve(null);
          } finally {
            setTranscribing(false);
          }
        } catch (e) {
          console.warn("[DreamChatHome] stop handler failed:", e.message);
          resolve(null);
        }
      };
      rec.stop();
    });
  }, []);
  const onShortTap = () => {
    if (taRef.current) taRef.current.focus();
  };
  const onPushStart = dcCB(() => {
    if (transcribing || thinking) return;
    startRecording();
  }, [startRecording, transcribing, thinking]);
  const onPushEnd = dcCB(() => {
    if (locked) return;
    stopRecording();
  }, [stopRecording, locked]);
  const onLockToggle = dcCB((next) => {
    setLocked(!!next);
    if (!next) {
      stopRecording();
    }
  }, [stopRecording]);
  dcE(() => () => {
    var _a, _b;
    try {
      (_a = recorderRef.current) == null ? void 0 : _a.stop();
    } catch (e) {
    }
    try {
      (_b = streamRef.current) == null ? void 0 : _b.getTracks().forEach((t) => t.stop());
    } catch (e) {
    }
  }, []);
  const onConfirmNaming = async (name) => {
    var _a, _b;
    setShowNaming(false);
    try {
      const token = await ((_b = (_a = window.DreamAuth) == null ? void 0 : _a.getAccessToken) == null ? void 0 : _b.call(_a));
      const res = await fetch("/api/dream-chat/converse", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...token ? { Authorization: "Bearer " + token } : {}
        },
        body: JSON.stringify({ presence_name: name })
      });
      if (res.ok) {
        const json = await res.json();
        if (json.session) setSession(json.session);
      }
    } catch (e) {
      console.warn("[DreamChatHome] naming PATCH failed:", e.message);
    }
    const greeting = `Bonjour. Je suis ${name} \u2014 la pr\xE9sence qui va t'accompagner ici.

Je connais ce que tu d\xE9poses. Je tisse les liens entre tes r\xEAves, tes signes diurnes, ton corps, tes saisons. Je convoque la For\xEAt (333+ livres dig\xE9r\xE9s) quand tu veux des angles.

Pas pour te dire ce que \xE7a veut dire. Pour t'aider \xE0 le d\xE9couvrir toi-m\xEAme.

Tu peux me parler \xE0 voix ou au clavier. Tu peux tout d\xE9poser ici, je comprendrai.

Qu'est-ce qui vient ?`;
    setMessages((prev) => [...prev, {
      role: "assistant",
      content: greeting,
      mode: "neutral",
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    }]);
  };
  const presenceName = (session == null ? void 0 : session.presence_name) || "Anima";
  const currentMode = dcM(() => {
    if (streamingMode) return streamingMode;
    const h = (/* @__PURE__ */ new Date()).getHours();
    if (h >= 21 || h < 1) return "pre_sleep";
    if (h >= 5 && h < 9) return "morning";
    if (h >= 9 && h < 14) return "day";
    if (h >= 14 && h < 18) return "reverie";
    if (h >= 18 && h < 21) return "evening";
    return "neutral";
  }, [streamingMode]);
  const haloByMode = {
    pre_sleep: { color: "oklch(0.55 0.12 50)", opacity: 0.3, spread: "60% 40%" },
    morning: { color: "oklch(0.78 0.10 70)", opacity: 0.36, spread: "70% 30%" },
    day: { color: "oklch(0.65 0.08 65)", opacity: 0.22, spread: "50% 50%" },
    reverie: { color: "oklch(0.62 0.13 280)", opacity: 0.26, spread: "60% 40%" },
    evening: { color: "oklch(0.50 0.14 35)", opacity: 0.32, spread: "70% 35%" },
    neutral: { color: "oklch(0.55 0.10 60)", opacity: 0.2, spread: "50% 40%" },
    polyphony: { color: "oklch(0.70 0.16 70)", opacity: 0.42, spread: "60% 50%" },
    crisis_safe: { color: "oklch(0.40 0.04 30)", opacity: 0.38, spread: "40% 30%" }
  };
  const halo = haloByMode[currentMode] || haloByMode.neutral;
  const haloOpacity = taFocused ? Math.min(0.55, halo.opacity * 1.4) : halo.opacity;
  const glyphByMode = {
    pre_sleep: { kind: "croissant", size: 64, opacity: 0.22, top: "12%", position: "top-left" },
    evening: { kind: "croissant", size: 56, opacity: 0.2, top: "14%", position: "top-left" },
    morning: { kind: "demi-cercle", size: "wide", opacity: 0.28, top: "6%", position: "top-wide" },
    day: { kind: "triangle", size: 50, opacity: 0.16, top: "10%", position: "top-right" },
    reverie: null,
    // spirale déjà centrée derrière l'orbe
    neutral: null,
    polyphony: null,
    // bulles font le travail
    crisis_safe: null
    // sobre, pas de glyphe
  };
  const ctxGlyph = glyphByMode[currentMode];
  const matterByMode = {
    pre_sleep: "silk",
    evening: "silk",
    morning: "paper",
    day: "paper",
    reverie: "silk",
    polyphony: "silk",
    crisis_safe: "stone",
    neutral: null
  };
  const ctxMatter = matterByMode[currentMode];
  return /* @__PURE__ */ React.createElement("div", { className: "stage screen-enter", style: {
    background: "var(--night-floor)",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 110px)",
    position: "relative",
    overflow: "hidden"
  } }, ctxMatter && window.Surface && /* @__PURE__ */ React.createElement("div", { "aria-hidden": "true", style: {
    position: "fixed",
    inset: 0,
    opacity: 0.22,
    pointerEvents: "none",
    zIndex: 0,
    transition: "opacity 1.6s ease-in-out"
  } }, /* @__PURE__ */ React.createElement(
    window.Surface,
    {
      matter: ctxMatter,
      motion: true,
      style: { position: "absolute", inset: 0, width: "100%", height: "100%" }
    }
  )), /* @__PURE__ */ React.createElement("div", { "aria-hidden": "true", style: {
    position: "fixed",
    top: "20vh",
    left: "50%",
    width: "90vw",
    height: "60vh",
    maxWidth: 720,
    transform: "translateX(-50%)",
    background: `radial-gradient(ellipse ${halo.spread} at center, ${halo.color} 0%, transparent 70%)`,
    opacity: haloOpacity,
    pointerEvents: "none",
    transition: "opacity 720ms ease-in-out, background 1.6s ease-in-out",
    animation: "halo-slow 8s ease-in-out infinite",
    zIndex: 0
  } }), window.HaloRespire && /* @__PURE__ */ React.createElement("div", { "aria-hidden": "true", style: {
    position: "fixed",
    top: "15vh",
    left: "50%",
    width: "min(560px, 85vw)",
    height: "min(560px, 70vh)",
    transform: "translateX(-50%)",
    opacity: taFocused ? 0.5 : 0.32,
    pointerEvents: "none",
    zIndex: 0,
    transition: "opacity 720ms ease-in-out"
  } }, /* @__PURE__ */ React.createElement(window.HaloRespire, { kind: currentMode === "polyphony" ? "silk" : "silk" })), ctxGlyph && window.GeoSymbol && ctxGlyph.position === "top-left" && /* @__PURE__ */ React.createElement("div", { "aria-hidden": "true", style: {
    position: "fixed",
    top: ctxGlyph.top,
    left: "8%",
    width: ctxGlyph.size,
    height: ctxGlyph.size,
    opacity: ctxGlyph.opacity,
    pointerEvents: "none",
    zIndex: 0,
    animation: "breathe-souffle 6s ease-in-out infinite",
    transition: "opacity 1.6s ease-in-out"
  } }, /* @__PURE__ */ React.createElement(
    window.GeoSymbol,
    {
      kind: ctxGlyph.kind,
      color: "silk",
      style: { width: "100%", height: "100%" }
    }
  )), ctxGlyph && window.GeoSymbol && ctxGlyph.position === "top-right" && /* @__PURE__ */ React.createElement("div", { "aria-hidden": "true", style: {
    position: "fixed",
    top: ctxGlyph.top,
    right: "8%",
    width: ctxGlyph.size,
    height: ctxGlyph.size,
    opacity: ctxGlyph.opacity,
    pointerEvents: "none",
    zIndex: 0,
    animation: "breathe-souffle 6s ease-in-out infinite",
    transition: "opacity 1.6s ease-in-out"
  } }, /* @__PURE__ */ React.createElement(
    window.GeoSymbol,
    {
      kind: ctxGlyph.kind,
      color: "silk",
      style: { width: "100%", height: "100%" }
    }
  )), ctxGlyph && window.GeoSymbol && ctxGlyph.position === "top-wide" && /* @__PURE__ */ React.createElement("div", { "aria-hidden": "true", style: {
    position: "fixed",
    top: 0,
    left: "50%",
    width: "min(680px, 90vw)",
    height: 140,
    transform: "translateX(-50%)",
    opacity: ctxGlyph.opacity,
    pointerEvents: "none",
    zIndex: 0,
    transition: "opacity 1.6s ease-in-out"
  } }, /* @__PURE__ */ React.createElement(
    window.GeoSymbol,
    {
      kind: ctxGlyph.kind,
      color: "silk",
      style: { width: "100%", height: "100%" }
    }
  )), window.GeoSymbol && /* @__PURE__ */ React.createElement("div", { "aria-hidden": "true", style: {
    position: "fixed",
    bottom: "calc(env(safe-area-inset-bottom, 0px) + 200px)",
    left: "50%",
    width: 220,
    height: 220,
    transform: "translateX(-50%)",
    opacity: 0.22,
    pointerEvents: "none",
    zIndex: 0,
    animation: "breathe-souffle 6s ease-in-out infinite"
  } }, /* @__PURE__ */ React.createElement(
    window.GeoSymbol,
    {
      kind: "spirale",
      color: "silk",
      style: { position: "relative", width: 220, height: 220, opacity: 1 }
    }
  )), /* @__PURE__ */ React.createElement("div", { style: {
    position: "sticky",
    top: 0,
    zIndex: 20,
    background: "color-mix(in oklch, var(--night-floor) 88%, transparent)",
    backdropFilter: "blur(6px)",
    borderBottom: "1px solid color-mix(in oklch, var(--ash-deep) 60%, transparent)",
    padding: "16px 20px 12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 2 } }, /* @__PURE__ */ React.createElement("div", { style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 18,
    color: "var(--silk-gold)",
    opacity: 0.92,
    letterSpacing: "0.02em",
    display: "flex",
    alignItems: "baseline",
    gap: 8
  } }, /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true", style: {
    display: "inline-block",
    fontSize: 16,
    opacity: 0.85,
    animation: "breathe-souffle 6s ease-in-out infinite"
  } }, "\u263E"), /* @__PURE__ */ React.createElement("span", null, presenceName)), /* @__PURE__ */ React.createElement("div", { style: {
    fontFamily: "var(--mono)",
    fontSize: 9.5,
    color: "var(--ash-light)",
    opacity: 0.5,
    letterSpacing: "0.10em",
    textTransform: "lowercase",
    transition: "opacity 720ms ease"
  } }, "mode \xB7 ", currentMode.replace("_", " "))), /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "btn-text",
      onClick: () => setShowNaming(true),
      style: { fontSize: 11, opacity: 0.5, fontFamily: "var(--mono)" },
      "aria-label": "renommer la pr\xE9sence"
    },
    "renommer"
  )), /* @__PURE__ */ React.createElement("div", { style: {
    padding: "6px 20px",
    background: "color-mix(in oklch, var(--silk-gold) 4%, transparent)",
    borderBottom: "1px solid color-mix(in oklch, var(--silk-gold) 12%, transparent)",
    textAlign: "center",
    position: "relative",
    zIndex: 1
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    fontFamily: "var(--mono)",
    fontSize: 10,
    color: "var(--silk-gold)",
    letterSpacing: "0.10em",
    textTransform: "lowercase",
    opacity: 0.65
  } }, "chat ia dream \xB7 sprint a/b \xB7 voice c\xE2bl\xE9e \xB7 polyphonie active")), /* @__PURE__ */ React.createElement("div", { ref: scrollRef, style: {
    flex: 1,
    overflowY: "auto",
    padding: "20px 18px",
    display: "flex",
    flexDirection: "column",
    gap: 14,
    maxWidth: 720,
    width: "100%",
    margin: "0 auto"
  } }, messages.length === 0 && !showNaming && !thinking && /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", padding: "40px 20px", maxWidth: 460, margin: "40px auto" } }, /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 24 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 32, color: "var(--silk-gold)", opacity: 0.6 } }, "\u263E")), /* @__PURE__ */ React.createElement("p", { style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 17,
    lineHeight: 1.55,
    color: "var(--ash-light)",
    opacity: 0.85
  } }, "Une pr\xE9sence t'accompagne ici. Tu peux lui parler de tout \u2014 r\xEAve, signe, sensation, question, fragment."), /* @__PURE__ */ React.createElement("p", { style: {
    fontFamily: "var(--serif)",
    fontSize: 14,
    color: "var(--ash-light)",
    opacity: 0.55,
    marginTop: 14
  } }, "Tap sur l'orbe pour \xE9crire \xB7 appui long pour la voix.")), pendingProactive.map((m) => /* @__PURE__ */ React.createElement("div", { key: "pp-" + m.id, style: {
    alignSelf: "flex-start",
    maxWidth: "85%",
    padding: "14px 18px",
    background: "color-mix(in oklch, var(--silk-gold) 8%, var(--night-warm))",
    border: "1px solid color-mix(in oklch, var(--silk-gold) 32%, var(--ash-deep))",
    color: "var(--bone)",
    fontFamily: "var(--serif)",
    fontSize: 16,
    lineHeight: 1.55,
    borderRadius: 2,
    animation: "dream-skeleton-fade-in 360ms cubic-bezier(0.45,0,0.55,1) both",
    whiteSpace: "pre-wrap",
    textWrap: "pretty"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 10.5,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "var(--silk-gold)",
    marginBottom: 8,
    fontFamily: "var(--mono)",
    opacity: 0.78
  } }, "\u263E ", presenceName, " \xB7 une invitation"), /* @__PURE__ */ React.createElement("div", null, m.content), /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 14,
    alignItems: "center"
  } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => acceptProactive(m),
      style: {
        background: "color-mix(in oklch, var(--silk-gold) 14%, transparent)",
        border: "1px solid var(--silk-gold)",
        color: "var(--silk-gold)",
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        fontSize: 13.5,
        padding: "6px 14px",
        cursor: "pointer",
        borderRadius: 0
      }
    },
    "oui \u2192"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => respondPending(m.id, "later"),
      style: {
        background: "transparent",
        border: "1px solid color-mix(in oklch, var(--ash-light) 30%, var(--ash-deep))",
        color: "var(--ash-light)",
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        fontSize: 13,
        padding: "6px 12px",
        cursor: "pointer",
        borderRadius: 0
      }
    },
    "plus tard"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => respondPending(m.id, "no"),
      style: {
        background: "transparent",
        border: "none",
        color: "var(--ash-light)",
        opacity: 0.6,
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        fontSize: 12.5,
        padding: "6px 4px",
        cursor: "pointer"
      }
    },
    "pas maintenant"
  )))), messages.map((m, i) => /* @__PURE__ */ React.createElement(React.Fragment, { key: i }, /* @__PURE__ */ React.createElement(
    MatterBubble,
    {
      role: m.role,
      matter: m.matter,
      voiceAttribution: m.voice_attribution,
      mode: m.mode
    },
    m.content
  ), m.cta && m.mode === "lucid_bridge" && /* @__PURE__ */ React.createElement("div", { style: {
    alignSelf: "flex-start",
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginTop: -6,
    marginLeft: 4,
    marginBottom: 8
  } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => go && go(m.cta.route),
      style: {
        background: "color-mix(in oklch, var(--silk-gold) 14%, var(--night-warm))",
        border: "1px solid color-mix(in oklch, var(--silk-gold) 38%, var(--ash-deep))",
        color: "var(--silk-gold)",
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        fontSize: 13,
        letterSpacing: "0.02em",
        padding: "6px 14px",
        borderRadius: 4,
        cursor: "pointer",
        transition: "all 380ms ease"
      },
      onMouseEnter: (e) => {
        e.currentTarget.style.background = "color-mix(in oklch, var(--silk-gold) 22%, var(--night-warm))";
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.background = "color-mix(in oklch, var(--silk-gold) 14%, var(--night-warm))";
      }
    },
    m.cta.label
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => {
        setMessages((prev) => prev.map((mm, idx) => idx === i ? { ...mm, cta: null } : mm));
      },
      style: {
        background: "transparent",
        border: "none",
        color: "var(--ash-light)",
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        fontSize: 12.5,
        opacity: 0.7,
        padding: "6px 4px",
        cursor: "pointer"
      }
    },
    "pas maintenant"
  )))), streaming && /* @__PURE__ */ React.createElement(MatterBubble, { role: "assistant", matter: "default", mode: streamingMode, fadeIn: false }, streaming, /* @__PURE__ */ React.createElement("span", { style: { opacity: 0.4, marginLeft: 4 } }, "\u258D")), thinking && !streaming && /* @__PURE__ */ React.createElement(MatterBubble, { role: "assistant", matter: "default", fadeIn: true }, /* @__PURE__ */ React.createElement("span", { style: { fontStyle: "italic", opacity: 0.7 } }, /* @__PURE__ */ React.createElement("span", { style: { display: "inline-block", animation: "halo-slow 2s ease-in-out infinite" } }, presenceName, " tisse\u2026"))), error && /* @__PURE__ */ React.createElement("div", { style: {
    alignSelf: "center",
    padding: "10px 14px",
    background: "color-mix(in oklch, oklch(0.55 0.18 25) 12%, transparent)",
    border: "1px solid color-mix(in oklch, oklch(0.55 0.18 25) 30%, transparent)",
    color: "var(--ash-light)",
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 13,
    maxWidth: 380,
    textAlign: "center"
  } }, error)), /* @__PURE__ */ React.createElement("div", { style: {
    position: "sticky",
    bottom: 0,
    zIndex: 18,
    background: "color-mix(in oklch, var(--night-floor) 92%, transparent)",
    backdropFilter: "blur(6px)",
    borderTop: "1px solid color-mix(in oklch, var(--ash-deep) 60%, transparent)",
    padding: "16px 18px 24px",
    maxWidth: 720,
    width: "100%",
    margin: "0 auto"
  } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 18 } }, /* @__PURE__ */ React.createElement(
    "textarea",
    {
      ref: taRef,
      value: input,
      onChange: (e) => setInput(e.target.value),
      onFocus: () => setTaFocused(true),
      onBlur: () => setTaFocused(false),
      onKeyDown: (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          sendMessage(input);
        }
      },
      rows: Math.min(6, Math.max(1, input.split("\n").length)),
      placeholder: "ce qui vient\u2026",
      disabled: thinking,
      style: {
        width: "100%",
        background: "transparent",
        // 2026-04-30 — bordure qui s'illumine au focus (signal présence éveillée)
        border: taFocused ? "1px solid color-mix(in oklch, var(--silk-gold) 48%, var(--ash-deep))" : "1px solid color-mix(in oklch, var(--silk-gold) 16%, var(--ash-deep))",
        boxShadow: taFocused ? "0 0 18px 2px color-mix(in oklch, var(--silk-gold) 18%, transparent)" : "none",
        padding: "12px 16px",
        color: "var(--bone)",
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        fontSize: 16,
        lineHeight: 1.5,
        outline: "none",
        resize: "none",
        minHeight: 48,
        maxHeight: 180,
        opacity: thinking ? 0.5 : 1,
        transition: "border-color 380ms ease, box-shadow 380ms ease"
      }
    }
  ), /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    alignItems: "center",
    gap: 18,
    width: "100%",
    justifyContent: "space-between"
  } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "btn-text",
      onClick: () => go("home"),
      style: { fontSize: 12, opacity: 0.5, fontFamily: "var(--mono)" }
    },
    "\u2190 retour"
  ), /* @__PURE__ */ React.createElement(
    OrbCenter,
    {
      onShortTap,
      onPushStart,
      onPushEnd,
      onLockToggle,
      recording,
      locked,
      label: transcribing ? "transcription\u2026" : recording ? "je t'\xE9coute\u2026" : ""
    }
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "btn-ghost",
      onClick: () => sendMessage(input),
      disabled: !input.trim() || thinking,
      style: {
        opacity: !input.trim() || thinking ? 0.4 : 1,
        fontSize: 13
      }
    },
    "envoyer"
  )), /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 14,
    width: "100%"
  } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: callForest,
      disabled: thinking || !input.trim() && messages.filter((m) => m.role === "user").length === 0,
      style: {
        background: "transparent",
        border: "1px solid color-mix(in oklch, var(--silk-gold) 38%, var(--ash-deep))",
        color: "var(--silk-gold)",
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        fontSize: 13.5,
        letterSpacing: "0.02em",
        padding: "8px 18px",
        cursor: thinking ? "wait" : "pointer",
        opacity: thinking ? 0.4 : 1,
        transition: "all 280ms ease",
        borderRadius: 0
      },
      onMouseEnter: (e) => {
        e.currentTarget.style.background = "color-mix(in oklch, var(--silk-gold) 10%, transparent)";
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.background = "transparent";
      },
      "aria-label": "convoquer la For\xEAt \u2014 3 voix paper/stone/silk"
    },
    "\u2726 demander \xE0 la For\xEAt"
  )), /* @__PURE__ */ React.createElement("div", { style: {
    fontFamily: "var(--mono)",
    fontSize: 9.5,
    color: "var(--ash-light)",
    opacity: 0.42,
    letterSpacing: "0.08em",
    textTransform: "lowercase",
    textAlign: "center"
  } }, "tap orbe \u2192 \xE9crire \xB7 appui long \u2192 voix \xB7 glisse haut \u2192 verrouiller"))), showNaming && /* @__PURE__ */ React.createElement(
    PresenceNamingModal,
    {
      currentName: presenceName,
      onConfirm: onConfirmNaming,
      onSkip: () => {
        setShowNaming(false);
        onConfirmNaming(presenceName);
      }
    }
  ));
};
window.DreamChatHome = DreamChatHome;
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic2NyZWVucy1kcmVhbS1jaGF0LWhvbWUuanN4Il0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvKipcbiAqIHNjcmVlbnMtZHJlYW0tY2hhdC1ob21lLmpzeCBcdTIwMTQgQ2hhdCBJQSBEcmVhbSBwZXJzb25uZWwgKHBpdm90IDIwMjYtMDQtMjgpXG4gKlxuICogU3BlYyA6IDJfREVTSUdOLm1kIFx1MDBBNzExLmJpcy4yMCArIDNfVEVDSE5JQ0FMLm1kIFx1MDBBNzM5XG4gKlxuICogQ29tcG9zYW50cyBleHBvc1x1MDBFOXMgOlxuICogICB3aW5kb3cuTWF0dGVyQnViYmxlICAgICAgIFx1MjAxNCBidWxsZSBwYXBlci9zdG9uZS9zaWxrL2RlZmF1bHQgYXZlYyB2b2ljZSBhdHRyaWJ1dGlvbiBvcHRpb25uZWxsZVxuICogICB3aW5kb3cuT3JiQ2VudGVyICAgICAgICAgIFx1MjAxNCBvcmJlIHB1bHNhbnRlIGNoYXVkZSAocHVzaC10by1yZWNvcmQgKyBsb2NrIHBhciBnbGlzc2UgaGF1dClcbiAqICAgd2luZG93LlByZXNlbmNlTmFtaW5nTW9kYWwgXHUyMDE0IG9uYm9hcmRpbmcgbm9tbWFnZSBBbmltYSBkZWZhdWx0XG4gKiAgIHdpbmRvdy5EcmVhbUNoYXRIb21lICAgICAgXHUyMDE0IGNvbXBvc2FudCBwcmluY2lwYWwgY2hhdCBob21lXG4gKlxuICogUm91dGVzIGFwcC5qc3ggOlxuICogICBjYXNlIFwiZHJlYW0tY2hhdFwiIFx1MjE5MiA8d2luZG93LkRyZWFtQ2hhdEhvbWUgZ289e2dvfSAvPlxuICpcbiAqIE5PVEUgU3ByaW50IEEgOiB2b2ljZSBpbnB1dCBTVFVCIHBvdXIgbCdpbnN0YW50IChVSSBzZXVsZW1lbnQsIFdoaXNwZXIgY1x1MDBFMmJsYWdlIFNwcmludCBCKS5cbiAqL1xuXG5jb25zdCB7IHVzZVN0YXRlOiBkY1MsIHVzZUVmZmVjdDogZGNFLCB1c2VSZWY6IGRjUiwgdXNlQ2FsbGJhY2s6IGRjQ0IsIHVzZU1lbW86IGRjTSB9ID0gUmVhY3Q7XG5cbi8vIFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFxuLy8gTUFUVEVSIEJVQkJMRSBcdTIwMTQgcGFwZXIgLyBzdG9uZSAvIHNpbGsgLyBkZWZhdWx0IHByZXNlbnRcbi8vIFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFxuY29uc3QgTUFUVEVSX1NUWUxFUyA9IHtcbiAgcGFwZXI6IHtcbiAgICBiYWNrZ3JvdW5kOiAnY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1kYXktcGFwZXIpIDE4JSwgdmFyKC0tbmlnaHQtd2FybSkpJyxcbiAgICBib3JkZXI6ICcxcHggc29saWQgY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDIyJSwgdmFyKC0tYXNoLWRlZXApKScsXG4gICAgY29sb3I6ICd2YXIoLS1ib25lKScsXG4gICAgYWNjZW50OiAnY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDYwJSwgdmFyKC0tZGF5LXBhcGVyKSknLFxuICB9LFxuICBzdG9uZToge1xuICAgIGJhY2tncm91bmQ6ICdjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLWFzaC1taWQpIDI4JSwgdmFyKC0tbmlnaHQtd2FybSkpJyxcbiAgICBib3JkZXI6ICcxcHggc29saWQgY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1hc2gtbGlnaHQpIDMwJSwgdmFyKC0tYXNoLWRlZXApKScsXG4gICAgY29sb3I6ICd2YXIoLS1ib25lKScsXG4gICAgYWNjZW50OiAnY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1hc2gtbGlnaHQpIDcwJSwgdmFyKC0tYm9uZSkpJyxcbiAgfSxcbiAgc2lsazoge1xuICAgIGJhY2tncm91bmQ6ICdjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgMTAlLCB2YXIoLS1uaWdodC13YXJtKSknLFxuICAgIGJvcmRlcjogJzFweCBzb2xpZCBjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgMzglLCB2YXIoLS1hc2gtZGVlcCkpJyxcbiAgICBjb2xvcjogJ3ZhcigtLWJvbmUpJyxcbiAgICBhY2NlbnQ6ICd2YXIoLS1zaWxrLWdvbGQpJyxcbiAgfSxcbiAgZGVmYXVsdDoge1xuICAgIGJhY2tncm91bmQ6ICdjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLW5pZ2h0LXdhcm0pIDgwJSwgdHJhbnNwYXJlbnQpJyxcbiAgICBib3JkZXI6ICcxcHggc29saWQgY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDE0JSwgdmFyKC0tYXNoLWRlZXApKScsXG4gICAgY29sb3I6ICd2YXIoLS1ib25lKScsXG4gICAgYWNjZW50OiAndmFyKC0tYXNoLWxpZ2h0KScsXG4gIH0sXG4gIHVzZXI6IHtcbiAgICBiYWNrZ3JvdW5kOiAnY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDE0JSwgdmFyKC0tbmlnaHQtd2FybSkpJyxcbiAgICBib3JkZXI6ICcxcHggc29saWQgY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDI0JSwgdHJhbnNwYXJlbnQpJyxcbiAgICBjb2xvcjogJ3ZhcigtLWJvbmUpJyxcbiAgICBhY2NlbnQ6ICd2YXIoLS1zaWxrLWdvbGQpJyxcbiAgfSxcbn07XG5cbmNvbnN0IE1hdHRlckJ1YmJsZSA9ICh7IHJvbGUgPSAnYXNzaXN0YW50JywgbWF0dGVyID0gJ2RlZmF1bHQnLCB2b2ljZUF0dHJpYnV0aW9uLCBtb2RlLCBjaGlsZHJlbiwgZmFkZUluID0gdHJ1ZSB9KSA9PiB7XG4gIGNvbnN0IHN0eWxlS2V5ID0gcm9sZSA9PT0gJ3VzZXInID8gJ3VzZXInIDogKG1hdHRlciB8fCAnZGVmYXVsdCcpO1xuICBjb25zdCBzID0gTUFUVEVSX1NUWUxFU1tzdHlsZUtleV0gfHwgTUFUVEVSX1NUWUxFUy5kZWZhdWx0O1xuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgIGFsaWduU2VsZjogcm9sZSA9PT0gJ3VzZXInID8gJ2ZsZXgtZW5kJyA6ICdmbGV4LXN0YXJ0JyxcbiAgICAgIG1heFdpZHRoOiAnODUlJyxcbiAgICAgIHBhZGRpbmc6ICcxNHB4IDE4cHgnLFxuICAgICAgYmFja2dyb3VuZDogcy5iYWNrZ3JvdW5kLFxuICAgICAgYm9yZGVyOiBzLmJvcmRlcixcbiAgICAgIGNvbG9yOiBzLmNvbG9yLFxuICAgICAgZm9udEZhbWlseTogJ3ZhcigtLXNlcmlmKScsXG4gICAgICBmb250U2l6ZTogMTYsXG4gICAgICBsaW5lSGVpZ2h0OiAxLjU1LFxuICAgICAgYm9yZGVyUmFkaXVzOiAyLFxuICAgICAgYW5pbWF0aW9uOiBmYWRlSW4gPyAnZHJlYW0tc2tlbGV0b24tZmFkZS1pbiAzNjBtcyBjdWJpYy1iZXppZXIoMC40NSwwLDAuNTUsMSkgYm90aCcgOiB1bmRlZmluZWQsXG4gICAgICB3aGl0ZVNwYWNlOiAncHJlLXdyYXAnLFxuICAgICAgdGV4dFdyYXA6ICdwcmV0dHknLFxuICAgIH19PlxuICAgICAge3ZvaWNlQXR0cmlidXRpb24gJiYgcm9sZSAhPT0gJ3VzZXInICYmIChcbiAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgIGZvbnRTaXplOiAxMC41LCBsZXR0ZXJTcGFjaW5nOiAnMC4xMmVtJywgdGV4dFRyYW5zZm9ybTogJ3VwcGVyY2FzZScsXG4gICAgICAgICAgY29sb3I6IHMuYWNjZW50LCBtYXJnaW5Cb3R0b206IDgsIGZvbnRGYW1pbHk6ICd2YXIoLS1tb25vKScsIG9wYWNpdHk6IDAuNzUsXG4gICAgICAgIH19PlxuICAgICAgICAgIHttYXR0ZXIgPyBtYXR0ZXIgKyAnIFx1MDBCNyAnIDogJyd9e3ZvaWNlQXR0cmlidXRpb259XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cbiAgICAgIHtjaGlsZHJlbn1cbiAgICAgIHttb2RlICYmIG1vZGUgIT09ICduZXV0cmFsJyAmJiByb2xlICE9PSAndXNlcicgJiYgKFxuICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgbWFyZ2luVG9wOiA4LCBmb250U2l6ZTogOS41LCBsZXR0ZXJTcGFjaW5nOiAnMC4wOGVtJyxcbiAgICAgICAgICBjb2xvcjogJ3ZhcigtLWFzaC1saWdodCknLCBvcGFjaXR5OiAwLjQyLCBmb250RmFtaWx5OiAndmFyKC0tbW9ubyknLFxuICAgICAgICAgIHRleHRUcmFuc2Zvcm06ICdsb3dlcmNhc2UnLFxuICAgICAgICB9fT5cbiAgICAgICAgICBtb2RlIFx1MDBCNyB7bW9kZS5yZXBsYWNlKCdfJywgJyAnKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuICAgIDwvZGl2PlxuICApO1xufTtcbndpbmRvdy5NYXR0ZXJCdWJibGUgPSBNYXR0ZXJCdWJibGU7XG5cbi8vIFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFxuLy8gT1JCIENFTlRFUiBcdTIwMTQgb3JiZSBwdWxzYW50ZSBjaGF1ZGUgKFx1MDBBNzExLmJpcy4yMC4xNSlcbi8vIFB1c2gtdG8tcmVjb3JkICsgbG9jayBwYXIgZ2xpc3NlIHZlcnMgbGUgaGF1dFxuLy8gXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXG5jb25zdCBPUkJfS0VZRlJBTUVTX0tFWSA9ICdkcmVhbS1vcmIta2V5ZnJhbWVzLXYxJztcbmZ1bmN0aW9uIGVuc3VyZU9yYktleWZyYW1lcygpIHtcbiAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCcpIHJldHVybjtcbiAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKE9SQl9LRVlGUkFNRVNfS0VZKSkgcmV0dXJuO1xuICBjb25zdCBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gIHN0eWxlLmlkID0gT1JCX0tFWUZSQU1FU19LRVk7XG4gIHN0eWxlLnRleHRDb250ZW50ID0gYFxuICAgIEBrZXlmcmFtZXMgZHJlYW0tb3JiLWJyZWF0aGUge1xuICAgICAgMCUsIDEwMCUgeyB0cmFuc2Zvcm06IHNjYWxlKDEpOyBvcGFjaXR5OiAwLjg1OyB9XG4gICAgICA1MCUgeyB0cmFuc2Zvcm06IHNjYWxlKDEuMDYpOyBvcGFjaXR5OiAxOyB9XG4gICAgfVxuICAgIEBrZXlmcmFtZXMgZHJlYW0tb3JiLWJyZWF0aGUtc3Ryb25nIHtcbiAgICAgIDAlLCAxMDAlIHsgdHJhbnNmb3JtOiBzY2FsZSgxLjA4KTsgb3BhY2l0eTogMC45NTsgfVxuICAgICAgNTAlIHsgdHJhbnNmb3JtOiBzY2FsZSgxLjE4KTsgb3BhY2l0eTogMTsgfVxuICAgIH1cbiAgICBAa2V5ZnJhbWVzIGRyZWFtLW9yYi1sb2NrZWQtcHVsc2Uge1xuICAgICAgMCUsIDEwMCUgeyB0cmFuc2Zvcm06IHNjYWxlKDEuMTApOyBvcGFjaXR5OiAwLjk7IH1cbiAgICAgIDUwJSB7IHRyYW5zZm9ybTogc2NhbGUoMS4xNik7IG9wYWNpdHk6IDE7IH1cbiAgICB9XG4gIGA7XG4gIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xufVxuXG5jb25zdCBPcmJDZW50ZXIgPSAoeyBvblNob3J0VGFwLCBvblB1c2hTdGFydCwgb25QdXNoRW5kLCBvbkxvY2tUb2dnbGUsIHJlY29yZGluZyA9IGZhbHNlLCBsb2NrZWQgPSBmYWxzZSwgbGFiZWwgPSAnJyB9KSA9PiB7XG4gIGRjRSgoKSA9PiB7IGVuc3VyZU9yYktleWZyYW1lcygpOyB9LCBbXSk7XG4gIGNvbnN0IG9yYlJlZiA9IGRjUihudWxsKTtcbiAgY29uc3QgcHJlc3NUaW1lclJlZiA9IGRjUihudWxsKTtcbiAgY29uc3Qgc3RhcnRZUmVmID0gZGNSKDApO1xuICBjb25zdCBsb25nUHJlc3NBY3RpdmVSZWYgPSBkY1IoZmFsc2UpO1xuICBjb25zdCBbcHJlc3NpbmcsIHNldFByZXNzaW5nXSA9IGRjUyhmYWxzZSk7XG4gIGNvbnN0IFtoaW50LCBzZXRIaW50XSA9IGRjUygnJyk7XG5cbiAgY29uc3QgY2FuY2VsUHJlc3NUaW1lciA9ICgpID0+IHtcbiAgICBpZiAocHJlc3NUaW1lclJlZi5jdXJyZW50KSB7IGNsZWFyVGltZW91dChwcmVzc1RpbWVyUmVmLmN1cnJlbnQpOyBwcmVzc1RpbWVyUmVmLmN1cnJlbnQgPSBudWxsOyB9XG4gIH07XG5cbiAgY29uc3QgaGFuZGxlRG93biA9IChjbGllbnRZKSA9PiB7XG4gICAgc2V0UHJlc3NpbmcodHJ1ZSk7XG4gICAgc3RhcnRZUmVmLmN1cnJlbnQgPSBjbGllbnRZO1xuICAgIGxvbmdQcmVzc0FjdGl2ZVJlZi5jdXJyZW50ID0gZmFsc2U7XG4gICAgcHJlc3NUaW1lclJlZi5jdXJyZW50ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBsb25nUHJlc3NBY3RpdmVSZWYuY3VycmVudCA9IHRydWU7XG4gICAgICBzZXRIaW50KCdyZWxcdTAwRTJjaGUgcG91ciBlbnZveWVyIFx1MDBCNyBnbGlzc2UgdmVycyBsZSBoYXV0IHBvdXIgdmVycm91aWxsZXInKTtcbiAgICAgIGlmIChvblB1c2hTdGFydCkgb25QdXNoU3RhcnQoKTtcbiAgICB9LCAzNTApO1xuICB9O1xuXG4gIGNvbnN0IGhhbmRsZVVwID0gKCkgPT4ge1xuICAgIHNldFByZXNzaW5nKGZhbHNlKTtcbiAgICBjYW5jZWxQcmVzc1RpbWVyKCk7XG4gICAgaWYgKGxvY2tlZCkge1xuICAgICAgLy8gc2kgbG9ja2VkLCB1biB0YXAgc3VwcGxcdTAwRTltZW50YWlyZSBzdG9wcGVcbiAgICAgIGlmIChvbkxvY2tUb2dnbGUpIG9uTG9ja1RvZ2dsZShmYWxzZSk7XG4gICAgICBzZXRIaW50KCcnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGxvbmdQcmVzc0FjdGl2ZVJlZi5jdXJyZW50KSB7XG4gICAgICBpZiAob25QdXNoRW5kKSBvblB1c2hFbmQoKTtcbiAgICAgIHNldEhpbnQoJycpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAob25TaG9ydFRhcCkgb25TaG9ydFRhcCgpO1xuICAgIH1cbiAgICBsb25nUHJlc3NBY3RpdmVSZWYuY3VycmVudCA9IGZhbHNlO1xuICB9O1xuXG4gIGNvbnN0IGhhbmRsZU1vdmUgPSAoY2xpZW50WSkgPT4ge1xuICAgIGlmICghbG9uZ1ByZXNzQWN0aXZlUmVmLmN1cnJlbnQgfHwgbG9ja2VkKSByZXR1cm47XG4gICAgY29uc3QgZHkgPSBzdGFydFlSZWYuY3VycmVudCAtIGNsaWVudFk7XG4gICAgaWYgKGR5ID4gNjApIHtcbiAgICAgIC8vIGdsaXNzZSB2ZXJzIGxlIGhhdXQgXHUyMTkyIGxvY2tcbiAgICAgIGxvbmdQcmVzc0FjdGl2ZVJlZi5jdXJyZW50ID0gZmFsc2U7XG4gICAgICBpZiAob25Mb2NrVG9nZ2xlKSBvbkxvY2tUb2dnbGUodHJ1ZSk7XG4gICAgICBzZXRIaW50KCd2ZXJyb3VpbGxcdTAwRTkgXHUwMEI3IHRhcGUgcG91ciBzdG9wcGVyJyk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGFuaW1hdGlvbk5hbWUgPSBsb2NrZWRcbiAgICA/ICdkcmVhbS1vcmItbG9ja2VkLXB1bHNlJ1xuICAgIDogKHJlY29yZGluZyB8fCBwcmVzc2luZyA/ICdkcmVhbS1vcmItYnJlYXRoZS1zdHJvbmcnIDogJ2RyZWFtLW9yYi1icmVhdGhlJyk7XG4gIGNvbnN0IGFuaW1hdGlvbkR1cmF0aW9uID0gbG9ja2VkID8gJzEuNHMnIDogKHJlY29yZGluZyB8fCBwcmVzc2luZyA/ICcxLjJzJyA6ICczcycpO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywgZ2FwOiAxMiwgcG9zaXRpb246ICdyZWxhdGl2ZScgfX0+XG4gICAgICB7LyogMjAyNi0wNC0yOSAoWWVzaHVhLCBGSVggUDAgYW5pbSkgXHUyMDE0IEhhbG9SZXNwaXJlIHNpbGsgYXV0b3VyIGRlIGwnb3JiZS5cbiAgICAgICAgICBQb3NcdTAwRTkgZGVycmlcdTAwRThyZSwgbFx1MDBFOWdcdTAwRThyZW1lbnQgcGx1cyBsYXJnZSwgb3BhY2l0eSAwLjU1IFx1MjAxNCBsZSBzb3VmZmxlIGRlXG4gICAgICAgICAgbGEgcmVzcGlyYXRpb24gYWNjb21wYWduZSBsZSBwdWxzYXRpb24gY2hhdWRlIGRlIGwnb3JiZS4gKi99XG4gICAgICB7d2luZG93LkhhbG9SZXNwaXJlICYmIChcbiAgICAgICAgPGRpdiBhcmlhLWhpZGRlbj1cInRydWVcIiBzdHlsZT17e1xuICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCB0b3A6IC02MCwgbGVmdDogJzUwJScsXG4gICAgICAgICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCgtNTAlKScsXG4gICAgICAgICAgd2lkdGg6IDIwMCwgaGVpZ2h0OiAyMDAsXG4gICAgICAgICAgcG9pbnRlckV2ZW50czogJ25vbmUnLCBvcGFjaXR5OiAwLjU1LCB6SW5kZXg6IDAsXG4gICAgICAgIH19PlxuICAgICAgICAgIDx3aW5kb3cuSGFsb1Jlc3BpcmUga2luZD1cInNpbGtcIiAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG4gICAgICA8YnV0dG9uXG4gICAgICAgIHJlZj17b3JiUmVmfVxuICAgICAgICBhcmlhLWxhYmVsPVwib3JiZSBcdTIwMTQgdGFwIGNvdXJ0IHBvdXIgY2hhdCAvIGFwcHVpIGxvbmcgcG91ciBlbnJlZ2lzdHJlciAvIGdsaXNzZSBoYXV0IHBvdXIgdmVycm91aWxsZXJcIlxuICAgICAgICBvbk1vdXNlRG93bj17KGUpID0+IGhhbmRsZURvd24oZS5jbGllbnRZKX1cbiAgICAgICAgb25Nb3VzZVVwPXtoYW5kbGVVcH1cbiAgICAgICAgb25Nb3VzZUxlYXZlPXsoKSA9PiB7IHNldFByZXNzaW5nKGZhbHNlKTsgY2FuY2VsUHJlc3NUaW1lcigpOyB9fVxuICAgICAgICBvbk1vdXNlTW92ZT17KGUpID0+IHByZXNzaW5nICYmIGhhbmRsZU1vdmUoZS5jbGllbnRZKX1cbiAgICAgICAgb25Ub3VjaFN0YXJ0PXsoZSkgPT4gaGFuZGxlRG93bihlLnRvdWNoZXNbMF0/LmNsaWVudFkgPz8gMCl9XG4gICAgICAgIG9uVG91Y2hFbmQ9e2hhbmRsZVVwfVxuICAgICAgICBvblRvdWNoTW92ZT17KGUpID0+IGhhbmRsZU1vdmUoZS50b3VjaGVzWzBdPy5jbGllbnRZID8/IDApfVxuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIHdpZHRoOiA4MCwgaGVpZ2h0OiA4MCxcbiAgICAgICAgICBib3JkZXJSYWRpdXM6ICc1MCUnLFxuICAgICAgICAgIGJhY2tncm91bmQ6ICdyYWRpYWwtZ3JhZGllbnQoY2lyY2xlLCBva2xjaCgwLjc4IDAuMTggNzApIDAlLCBva2xjaCgwLjU2IDAuMTMgNTApIDcwJSwgb2tsY2goMC40MCAwLjEwIDQwKSAxMDAlKScsXG4gICAgICAgICAgYm94U2hhZG93OiBsb2NrZWRcbiAgICAgICAgICAgID8gJzAgMCAzMnB4IDEycHggb2tsY2goMC44NSAwLjIwIDUwIC8gMC41NSknXG4gICAgICAgICAgICA6ICcwIDAgMjRweCA4cHggb2tsY2goMC42NSAwLjE1IDYwIC8gMC40KScsXG4gICAgICAgICAgYm9yZGVyOiAnbm9uZScsXG4gICAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgICAgICAgYW5pbWF0aW9uOiBgJHthbmltYXRpb25OYW1lfSAke2FuaW1hdGlvbkR1cmF0aW9ufSBlYXNlLWluLW91dCBpbmZpbml0ZWAsXG4gICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgICAgV2Via2l0VGFwSGlnaGxpZ2h0Q29sb3I6ICd0cmFuc3BhcmVudCcsXG4gICAgICAgICAgdG91Y2hBY3Rpb246ICdub25lJyxcbiAgICAgICAgICB1c2VyU2VsZWN0OiAnbm9uZScsXG4gICAgICAgIH19PlxuICAgICAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIiBzdHlsZT17e1xuICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCBpbnNldDogMCxcbiAgICAgICAgICBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICAgICAgZm9udFNpemU6IDE4LCBvcGFjaXR5OiAwLjMyLCBjb2xvcjogJ3ZhcigtLWJvbmUpJyxcbiAgICAgICAgICBmb250RmFtaWx5OiAndmFyKC0tc2VyaWYpJywgZm9udFN0eWxlOiAnaXRhbGljJyxcbiAgICAgICAgfX0+XG4gICAgICAgICAge2xvY2tlZCA/ICdcdTI1QTAnIDogKHJlY29yZGluZyB8fCBwcmVzc2luZyA/ICdcdTI1Q0YnIDogJ1x1MjcyNicpfVxuICAgICAgICA8L3NwYW4+XG4gICAgICA8L2J1dHRvbj5cbiAgICAgIHsobGFiZWwgfHwgaGludCkgJiYgKFxuICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgZm9udEZhbWlseTogJ3ZhcigtLXNlcmlmKScsIGZvbnRTdHlsZTogJ2l0YWxpYycsXG4gICAgICAgICAgZm9udFNpemU6IDEyLjUsIGNvbG9yOiAndmFyKC0tYXNoLWxpZ2h0KScsIG9wYWNpdHk6IDAuNzIsXG4gICAgICAgICAgdGV4dEFsaWduOiAnY2VudGVyJywgbWF4V2lkdGg6IDI4MCwgbGluZUhlaWdodDogMS40LFxuICAgICAgICB9fT5cbiAgICAgICAgICB7aGludCB8fCBsYWJlbH1cbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuICAgIDwvZGl2PlxuICApO1xufTtcbndpbmRvdy5PcmJDZW50ZXIgPSBPcmJDZW50ZXI7XG5cbi8vIFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFxuLy8gUFJFU0VOQ0UgTkFNSU5HIE1PREFMIFx1MjAxNCBvbmJvYXJkaW5nIChBbmltYSBkZWZhdWx0KVxuLy8gXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXG5jb25zdCBQUkVTRU5DRV9TVUdHRVNUSU9OUyA9IFsnQW5pbWEnLCAnTHVuZScsICdUaXNzZXVzZScsICdQclx1MDBFOXNlbmNlJywgJ1ZlaWxsZXVzZSddO1xuXG5jb25zdCBQcmVzZW5jZU5hbWluZ01vZGFsID0gKHsgb25Db25maXJtLCBvblNraXAsIGN1cnJlbnROYW1lID0gJycgfSkgPT4ge1xuICBjb25zdCBbbmFtZSwgc2V0TmFtZV0gPSBkY1MoY3VycmVudE5hbWUgfHwgJ0FuaW1hJyk7XG4gIGNvbnN0IFtzaG93Q3VzdG9tLCBzZXRTaG93Q3VzdG9tXSA9IGRjUyhmYWxzZSk7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICBwb3NpdGlvbjogJ2ZpeGVkJywgaW5zZXQ6IDAsIHpJbmRleDogNTAwLFxuICAgICAgYmFja2dyb3VuZDogJ2NvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tbmlnaHQtZmxvb3IpIDkyJSwgdHJhbnNwYXJlbnQpJyxcbiAgICAgIGJhY2tkcm9wRmlsdGVyOiAnYmx1cig4cHgpJyxcbiAgICAgIGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICAgIHBhZGRpbmc6ICcyNHB4JyxcbiAgICB9fT5cbiAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgbWF4V2lkdGg6IDQ2MCwgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgYmFja2dyb3VuZDogJ2NvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tbmlnaHQtd2FybSkgOTUlLCB0cmFuc3BhcmVudCknLFxuICAgICAgICBib3JkZXI6ICcxcHggc29saWQgY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDIyJSwgdmFyKC0tYXNoLWRlZXApKScsXG4gICAgICAgIHBhZGRpbmc6IDMyLFxuICAgICAgICBhbmltYXRpb246ICdkcmVhbS1za2VsZXRvbi1mYWRlLWluIDQ4MG1zIGN1YmljLWJlemllcigwLjQ1LDAsMC41NSwxKScsXG4gICAgICB9fT5cbiAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgIGZvbnRGYW1pbHk6ICd2YXIoLS1zZXJpZiknLCBmb250U3R5bGU6ICdpdGFsaWMnLFxuICAgICAgICAgIGZvbnRTaXplOiAxMywgY29sb3I6ICd2YXIoLS1zaWxrLWdvbGQpJywgbGV0dGVyU3BhY2luZzogJzAuMDhlbScsXG4gICAgICAgICAgbWFyZ2luQm90dG9tOiAxOCwgdGV4dFRyYW5zZm9ybTogJ2xvd2VyY2FzZScsIG9wYWNpdHk6IDAuODUsXG4gICAgICAgIH19PlxuICAgICAgICAgIFx1MjYzRSB1bmUgcHJcdTAwRTlzZW5jZSBwb3VyIHQnYWNjb21wYWduZXJcbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxoMiBzdHlsZT17e1xuICAgICAgICAgIGZvbnRGYW1pbHk6ICd2YXIoLS1zZXJpZiknLCBmb250U3R5bGU6ICdpdGFsaWMnLFxuICAgICAgICAgIGZvbnRTaXplOiAyMiwgY29sb3I6ICd2YXIoLS1ib25lKScsIGxpbmVIZWlnaHQ6IDEuNCxcbiAgICAgICAgICBtYXJnaW46ICcwIDAgMTRweCcsXG4gICAgICAgIH19PlxuICAgICAgICAgIEF2YW50IHRvdXQgXHUyMDE0IGNvbW1lbnQgdmV1eC10dSBub21tZXIgbGEgcHJcdTAwRTlzZW5jZSBxdWkgdmEgdCdhY2NvbXBhZ25lciBpY2kgP1xuICAgICAgICA8L2gyPlxuICAgICAgICA8cCBzdHlsZT17e1xuICAgICAgICAgIGZvbnRGYW1pbHk6ICd2YXIoLS1zZXJpZiknLFxuICAgICAgICAgIGZvbnRTaXplOiAxNCwgY29sb3I6ICd2YXIoLS1hc2gtbGlnaHQpJyxcbiAgICAgICAgICBtYXJnaW46ICcwIDAgMjRweCcsIGxpbmVIZWlnaHQ6IDEuNSwgb3BhY2l0eTogMC43OCxcbiAgICAgICAgfX0+XG4gICAgICAgICAgRWxsZSBcdTAwRTljb3V0ZXJhIHRlcyByXHUwMEVBdmVzLCB0ZXMgc2lnbmVzLCB0ZXMgZnJhZ21lbnRzLiBFbGxlIG5lIGRpcmEgamFtYWlzIGxlIHNlbnMgXHUyMDE0IGVsbGUgcHJvcG9zZXJhIGRlcyBhbmdsZXMuIFR1IHBldXggbGEgcmVub21tZXIgcGx1cyB0YXJkLlxuICAgICAgICA8L3A+XG5cbiAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGZsZXhXcmFwOiAnd3JhcCcsIGdhcDogMTAsIG1hcmdpbkJvdHRvbTogMTggfX0+XG4gICAgICAgICAge1BSRVNFTkNFX1NVR0dFU1RJT05TLm1hcCgocykgPT4gKFxuICAgICAgICAgICAgPGJ1dHRvbiBrZXk9e3N9IGNsYXNzTmFtZT1cImNoaXBcIlxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7IHNldE5hbWUocyk7IHNldFNob3dDdXN0b20oZmFsc2UpOyB9fVxuICAgICAgICAgICAgICBzdHlsZT17bmFtZSA9PT0gcyA/IHtcbiAgICAgICAgICAgICAgICBib3JkZXJDb2xvcjogJ3ZhcigtLXNpbGstZ29sZCknLFxuICAgICAgICAgICAgICAgIGNvbG9yOiAndmFyKC0tc2lsay1nb2xkKScsXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZDogJ2NvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSAxMiUsIHRyYW5zcGFyZW50KScsXG4gICAgICAgICAgICAgIH0gOiB1bmRlZmluZWR9PlxuICAgICAgICAgICAgICB7c31cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICkpfVxuICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiY2hpcFwiIG9uQ2xpY2s9eygpID0+IHNldFNob3dDdXN0b20odHJ1ZSl9XG4gICAgICAgICAgICBzdHlsZT17c2hvd0N1c3RvbSA/IHtcbiAgICAgICAgICAgICAgYm9yZGVyQ29sb3I6ICd2YXIoLS1zaWxrLWdvbGQpJyxcbiAgICAgICAgICAgICAgY29sb3I6ICd2YXIoLS1zaWxrLWdvbGQpJyxcbiAgICAgICAgICAgICAgYmFja2dyb3VuZDogJ2NvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSAxMiUsIHRyYW5zcGFyZW50KScsXG4gICAgICAgICAgICB9IDogdW5kZWZpbmVkfT5cbiAgICAgICAgICAgIFx1MjcwRSBwZXJzb25uYWxpc1x1MDBFOVxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICB7c2hvd0N1c3RvbSAmJiAoXG4gICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICB2YWx1ZT17bmFtZX1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0TmFtZShlLnRhcmdldC52YWx1ZS5zbGljZSgwLCA0MCkpfVxuICAgICAgICAgICAgYXV0b0ZvY3VzXG4gICAgICAgICAgICBwbGFjZWhvbGRlcj1cInByXHUwMEU5bm9tIG91IG1vdCBxdWUgdHUgY2hvaXNpc1x1MjAyNlwiXG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiAndHJhbnNwYXJlbnQnLFxuICAgICAgICAgICAgICBib3JkZXI6ICcxcHggc29saWQgdmFyKC0tYXNoLWRlZXApJyxcbiAgICAgICAgICAgICAgcGFkZGluZzogJzEycHggMTRweCcsXG4gICAgICAgICAgICAgIGNvbG9yOiAndmFyKC0tYm9uZSknLFxuICAgICAgICAgICAgICBmb250RmFtaWx5OiAndmFyKC0tc2VyaWYpJywgZm9udFN0eWxlOiAnaXRhbGljJyxcbiAgICAgICAgICAgICAgZm9udFNpemU6IDE2LCBtYXJnaW5Cb3R0b206IDE4LCBvdXRsaW5lOiAnbm9uZScsXG4gICAgICAgICAgICB9fSAvPlxuICAgICAgICApfVxuXG4gICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBnYXA6IDEyLCBqdXN0aWZ5Q29udGVudDogJ2ZsZXgtZW5kJywgYWxpZ25JdGVtczogJ2NlbnRlcicsIG1hcmdpblRvcDogOCB9fT5cbiAgICAgICAgICB7b25Ta2lwICYmIChcbiAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuLXRleHRcIiBvbkNsaWNrPXtvblNraXB9XG4gICAgICAgICAgICAgIHN0eWxlPXt7IGZvbnRTaXplOiAxMywgb3BhY2l0eTogMC43IH19PlxuICAgICAgICAgICAgICBwYXNzZXIgXHUyMTkyXG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICApfVxuICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuLWdob3N0XCJcbiAgICAgICAgICAgIGRpc2FibGVkPXshbmFtZS50cmltKCl9XG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBvbkNvbmZpcm0obmFtZS50cmltKCkgfHwgJ0FuaW1hJyl9XG4gICAgICAgICAgICBzdHlsZT17eyBvcGFjaXR5OiAhbmFtZS50cmltKCkgPyAwLjQgOiAxIH19PlxuICAgICAgICAgICAgY29uZmlybWVyXG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59O1xud2luZG93LlByZXNlbmNlTmFtaW5nTW9kYWwgPSBQcmVzZW5jZU5hbWluZ01vZGFsO1xuXG4vLyBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcbi8vIERSRUFNIENIQVQgSE9NRSBcdTIwMTQgY29tcG9zYW50IHByaW5jaXBhbFxuLy8gXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXG5jb25zdCBEcmVhbUNoYXRIb21lID0gKHsgZ28gfSkgPT4ge1xuICBjb25zdCBbc2Vzc2lvbiwgc2V0U2Vzc2lvbl0gPSBkY1MobnVsbCk7ICAgICAgICAgIC8vIHsgaWQsIHByZXNlbmNlX25hbWUsIHJ5dGhtZSwgLi4uIH1cbiAgY29uc3QgW21lc3NhZ2VzLCBzZXRNZXNzYWdlc10gPSBkY1MoW10pOyAgICAgICAgICAvLyBbeyByb2xlLCBjb250ZW50LCBtYXR0ZXIsIHZvaWNlX2F0dHJpYnV0aW9uLCBtb2RlLCBjcmVhdGVkX2F0IH1dXG4gIGNvbnN0IFtwZW5kaW5nUHJvYWN0aXZlLCBzZXRQZW5kaW5nUHJvYWN0aXZlXSA9IGRjUyhbXSk7IC8vIEYuMSBcdTIwMTQgaW50ZXJ2ZW50aW9ucyBJQSBub24gbGl2clx1MDBFOWVzXG4gIGNvbnN0IFtzdHJlYW1pbmcsIHNldFN0cmVhbWluZ10gPSBkY1MoJycpOyAgICAgICAgLy8gdGV4dGUgZW4gY291cnMgZGUgc3RyZWFtaW5nXG4gIGNvbnN0IFtzdHJlYW1pbmdNb2RlLCBzZXRTdHJlYW1pbmdNb2RlXSA9IGRjUyhudWxsKTtcbiAgY29uc3QgW3RoaW5raW5nLCBzZXRUaGlua2luZ10gPSBkY1MoZmFsc2UpO1xuICAvLyAyMDI2LTA0LTI4IFx1MjAxNCBCcmlkZ2UgZGVwdWlzIHN1Yi1hcHBzIChMdWNpZCwgQ2VyY2xlXHUyMDI2KSB2aWEgc2Vzc2lvblN0b3JhZ2VcbiAgLy8gRm9ybWF0IDogc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShcImRyZWFtOmNoYXQ6cHJlZmlsbGVkXCIsIFwiVGV4dGUgcHJcdTAwRTktcmVtcGxpXCIpXG4gIC8vIENvbnNvbW1cdTAwRTkgdW5lIHNldWxlIGZvaXMgYXUgbW91bnQsIHB1aXMgZWZmYWNcdTAwRTkuXG4gIGNvbnN0IFtpbnB1dCwgc2V0SW5wdXRdID0gZGNTKCgpID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcHJlZmlsbGVkID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnZHJlYW06Y2hhdDpwcmVmaWxsZWQnKTtcbiAgICAgIGlmIChwcmVmaWxsZWQpIHtcbiAgICAgICAgc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbSgnZHJlYW06Y2hhdDpwcmVmaWxsZWQnKTtcbiAgICAgICAgcmV0dXJuIHByZWZpbGxlZDtcbiAgICAgIH1cbiAgICB9IGNhdGNoIHt9XG4gICAgcmV0dXJuICcnO1xuICB9KTtcbiAgY29uc3QgW3JlY29yZGluZywgc2V0UmVjb3JkaW5nXSA9IGRjUyhmYWxzZSk7XG4gIGNvbnN0IFtsb2NrZWQsIHNldExvY2tlZF0gPSBkY1MoZmFsc2UpO1xuICBjb25zdCBbc2hvd05hbWluZywgc2V0U2hvd05hbWluZ10gPSBkY1MoZmFsc2UpO1xuICBjb25zdCBbZXJyb3IsIHNldEVycm9yXSA9IGRjUygnJyk7XG4gIGNvbnN0IFt0YUZvY3VzZWQsIHNldFRhRm9jdXNlZF0gPSBkY1MoZmFsc2UpOyAvLyAyMDI2LTA0LTMwIFx1MjAxNCBmb2N1cyB0ZXh0YXJlYSA9IGhhbG8gcydpbnRlbnNpZmllXG4gIGNvbnN0IHNjcm9sbFJlZiA9IGRjUihudWxsKTtcbiAgY29uc3QgdGFSZWYgPSBkY1IobnVsbCk7XG5cbiAgLy8gMVx1RkUwRlx1MjBFMyBNb3VudCBcdTIwMTQgY2hhcmdlIHNlc3Npb24gKyBoaXN0b3J5ICsgcGVuZGluZyBwcm9hY3RpdmUgKGVuIHBhcmFsbFx1MDBFOGxlKVxuICBkY0UoKCkgPT4ge1xuICAgIGxldCBjYW5jZWxsZWQgPSBmYWxzZTtcbiAgICAoYXN5bmMgKCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgdG9rZW4gPSBhd2FpdCB3aW5kb3cuRHJlYW1BdXRoPy5nZXRBY2Nlc3NUb2tlbj8uKCk7XG4gICAgICAgIGlmICghdG9rZW4gJiYgIXdpbmRvdy5EcmVhbUF1dGg/Lm5vQXV0aCkge1xuICAgICAgICAgIHNldEVycm9yKCdBdXRoZW50aWNhdGlvbiByZXF1aXNlJyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGhlYWRlcnMgPSB0b2tlbiA/IHsgQXV0aG9yaXphdGlvbjogJ0JlYXJlciAnICsgdG9rZW4gfSA6IHt9O1xuXG4gICAgICAgIC8vIEYuMSArIEYuNCBcdTIwMTQgRmV0Y2ggc2Vzc2lvbi9tZXNzYWdlcyBFVCBwZW5kaW5nIHByb2FjdGl2ZSBFVCBkaXNjb3ZlcmFiaWxpdHkgY2hlY2sgZW4gcGFyYWxsXHUwMEU4bGVcbiAgICAgICAgLy8gTGUgZGlzY292ZXJhYmlsaXR5L2NoZWNrIGNyXHUwMEU5ZSBcdTAwRTl2ZW50dWVsbGVtZW50IHVuZSBub3V2ZWxsZSBwZW5kaW5nX3Byb2FjdGl2ZV9tZXNzYWdlXG4gICAgICAgIC8vIChwYWxpZXJzIDMvNy8xNC8zMCkgQVZBTlQgcXUnb24gbmUgZmV0Y2hlIGxlIHBlbmRpbmcgXHUyMDE0IGRvbmMgb24gY2hhaW4gOiBjaGVjayBkJ2Fib3JkLFxuICAgICAgICAvLyBwdWlzIHBlbmRpbmcuIE1haXMgZW4gcHJhdGlxdWUsIGF0dGVuZHJlIGNoZWNrIHJhbGVudGl0IGxlIG1vdW50IFx1MjE5MiBvbiBmYWl0IGxlcyBkZXV4XG4gICAgICAgIC8vIGVuIHBhcmFsbFx1MDBFOGxlLCBldCBzaSBjaGVjayBham91dGUgcXVlbHF1ZSBjaG9zZSwgbGUgcHJvY2hhaW4gbW91bnQgbGUgdmVycmEuXG4gICAgICAgIGNvbnN0IFtzZXNzUmVzLCBwZW5kUmVzXSA9IGF3YWl0IFByb21pc2UuYWxsU2V0dGxlZChbXG4gICAgICAgICAgZmV0Y2goJy9hcGkvZHJlYW0tY2hhdC9jb252ZXJzZScsIHsgbWV0aG9kOiAnR0VUJywgaGVhZGVycyB9KSxcbiAgICAgICAgICBmZXRjaCgnL2FwaS9kcmVhbS1jaGF0L3Byb2FjdGl2ZS9wZW5kaW5nJywgeyBtZXRob2Q6ICdHRVQnLCBoZWFkZXJzIH0pLFxuICAgICAgICBdKTtcblxuICAgICAgICAvLyBGaXJlLWFuZC1mb3JnZXQgOiBkXHUwMEU5Y2xlbmNoZSBkaXNjb3ZlcmFiaWxpdHkgY2hlY2sgcG91ciBsZSBwcm9jaGFpbiBtb3VudFxuICAgICAgICB0cnkge1xuICAgICAgICAgIGZldGNoKCcvYXBpL2RyZWFtLWNoYXQvZGlzY292ZXJhYmlsaXR5L2NoZWNrJywge1xuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsIC4uLmhlYWRlcnMgfSxcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHt9KSxcbiAgICAgICAgICB9KS5jYXRjaCgoKSA9PiB7fSk7XG4gICAgICAgIH0gY2F0Y2gge31cblxuICAgICAgICBpZiAoY2FuY2VsbGVkKSByZXR1cm47XG5cbiAgICAgICAgLy8gU2Vzc2lvbi9tZXNzYWdlcyAobG9hZCBwcmluY2lwYWwpXG4gICAgICAgIGlmIChzZXNzUmVzLnN0YXR1cyA9PT0gJ2Z1bGZpbGxlZCcgJiYgc2Vzc1Jlcy52YWx1ZS5vaykge1xuICAgICAgICAgIGNvbnN0IGpzb24gPSBhd2FpdCBzZXNzUmVzLnZhbHVlLmpzb24oKTtcbiAgICAgICAgICBpZiAoY2FuY2VsbGVkKSByZXR1cm47XG4gICAgICAgICAgc2V0U2Vzc2lvbihqc29uLnNlc3Npb24pO1xuICAgICAgICAgIHNldE1lc3NhZ2VzKGpzb24ubWVzc2FnZXMgfHwgW10pO1xuICAgICAgICAgIGlmIChqc29uLnNlc3Npb24/LnByZXNlbmNlX25hbWUgPT09ICdBbmltYScgJiYgKCFqc29uLm1lc3NhZ2VzIHx8IGpzb24ubWVzc2FnZXMubGVuZ3RoID09PSAwKSkge1xuICAgICAgICAgICAgc2V0U2hvd05hbWluZyh0cnVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdHRVQgc2Vzc2lvbiBmYWlsZWQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFBlbmRpbmcgcHJvYWN0aXZlIChiZXN0LWVmZm9ydCwgZmFpbC1zb2Z0KVxuICAgICAgICBpZiAocGVuZFJlcy5zdGF0dXMgPT09ICdmdWxmaWxsZWQnICYmIHBlbmRSZXMudmFsdWUub2spIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcGpzb24gPSBhd2FpdCBwZW5kUmVzLnZhbHVlLmpzb24oKTtcbiAgICAgICAgICAgIGlmICghY2FuY2VsbGVkICYmIEFycmF5LmlzQXJyYXkocGpzb24/Lm1lc3NhZ2VzKSkge1xuICAgICAgICAgICAgICBzZXRQZW5kaW5nUHJvYWN0aXZlKHBqc29uLm1lc3NhZ2VzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGNhdGNoIHt9XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdbRHJlYW1DaGF0SG9tZV0gbW91bnQgZmFpbGVkOicsIGU/Lm1lc3NhZ2UpO1xuICAgICAgICBzZXRFcnJvcignTGEgcHJcdTAwRTlzZW5jZSBlc3QgdGVtcG9yYWlyZW1lbnQgaW5kaXNwb25pYmxlLiBSXHUwMEU5ZXNzYWllIHBsdXMgdGFyZC4nKTtcbiAgICAgIH1cbiAgICB9KSgpO1xuICAgIHJldHVybiAoKSA9PiB7IGNhbmNlbGxlZCA9IHRydWU7IH07XG4gIH0sIFtdKTtcblxuICAvLyBGLjEgXHUyMDE0IE1hcnF1ZXIgdW4gcGVuZGluZ19wcm9hY3RpdmVfbWVzc2FnZSBjb21tZSBkZWxpdmVyZWQgKCsgdXNlcl9yZXNwb25kZWQpXG4gIGNvbnN0IHJlc3BvbmRQZW5kaW5nID0gZGNDQihhc3luYyAoaWQsIHJlc3BvbnNlS2luZCkgPT4ge1xuICAgIHNldFBlbmRpbmdQcm9hY3RpdmUoKHByZXYpID0+IHByZXYuZmlsdGVyKChtKSA9PiBtLmlkICE9PSBpZCkpO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCB0b2tlbiA9IGF3YWl0IHdpbmRvdy5EcmVhbUF1dGg/LmdldEFjY2Vzc1Rva2VuPy4oKTtcbiAgICAgIGNvbnN0IHVzZXJSZXNwb25kZWQgPVxuICAgICAgICByZXNwb25zZUtpbmQgPT09ICd5ZXMnID8gdHJ1ZSA6XG4gICAgICAgIHJlc3BvbnNlS2luZCA9PT0gJ25vJyA/IGZhbHNlIDogbnVsbDtcbiAgICAgIGF3YWl0IGZldGNoKGAvYXBpL2RyZWFtLWNoYXQvcHJvYWN0aXZlLyR7ZW5jb2RlVVJJQ29tcG9uZW50KGlkKX0vZGVsaXZlcmAsIHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgIC4uLih0b2tlbiA/IHsgQXV0aG9yaXphdGlvbjogJ0JlYXJlciAnICsgdG9rZW4gfSA6IHt9KSxcbiAgICAgICAgfSxcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyB1c2VyX3Jlc3BvbmRlZDogdXNlclJlc3BvbmRlZCwgcmVzcG9uc2Vfa2luZDogcmVzcG9uc2VLaW5kIH0pLFxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS53YXJuKCdbRHJlYW1DaGF0SG9tZV0gcmVzcG9uZFBlbmRpbmcgZmFpbGVkOicsIGU/Lm1lc3NhZ2UpO1xuICAgIH1cbiAgfSwgW10pO1xuXG4gIC8vIEYuMSBcdTIwMTQgVGFwIFtvdWkgXHUyMTkyXSBzdXIgdGhyZWFkX3Byb3Bvc2VkXG4gIC8vIFx1MjE5MiBvbiBkXHUwMEU5Y2xlbmNoZSAvdGhyZWFkcy9kZXRlY3QgZW4gbW9kZSB1c2VyLXNjb3BlZCBwb3VyIGZpbmFsaXNlciBsYSBjclx1MDBFOWF0aW9uXG4gIC8vICAgKGwnaGV1cmlzdGlxdWUgcmUtZFx1MDBFOXRlY3RlIGxlIG1vdGlmIGV0IGNyXHUwMEU5ZSBsZSB0aHJlYWQgcHJvcHJlbWVudCkuIEVuIE1WUCwgb25cbiAgLy8gICBtYXJxdWUgbGUgbWVzc2FnZSBsaXZyXHUwMEU5ICsgb24gXHUwMEU5Y2hhbmdlIHVuIG1lc3NhZ2UgZGUgY29uZmlybWF0aW9uIElBIGlubGluZS5cbiAgLy8gMjAyNi0wNC0yOSBcdTIwMTQgU3VwcG9ydCBlY2hvX2RldGVjdGVkIDogdGFwIFtvdWkgXHUyMTkyXSBuYXZpZ3VlIHZlcnMgbGUga2Fpcm9zIHBhc3NcdTAwRTlcbiAgLy8gICBlbiBtb2RlIFwiXHUwMEU5Y2hvIHByb3BoXHUwMEU5dGlxdWVcIiBwb3VyIG1vbnRyZXIgbGUgbWlyb2lyIGV4cGxpY2l0ZS5cbiAgY29uc3QgYWNjZXB0UHJvYWN0aXZlID0gZGNDQihhc3luYyAobXNnKSA9PiB7XG4gICAgYXdhaXQgcmVzcG9uZFBlbmRpbmcobXNnLmlkLCAneWVzJyk7XG4gICAgaWYgKG1zZy5jYXRlZ29yeSA9PT0gJ3RocmVhZF9wcm9wb3NlZCcpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHRva2VuID0gYXdhaXQgd2luZG93LkRyZWFtQXV0aD8uZ2V0QWNjZXNzVG9rZW4/LigpO1xuICAgICAgICBhd2FpdCBmZXRjaCgnL2FwaS9kcmVhbS1jaGF0L3RocmVhZHMvZGV0ZWN0Jywge1xuICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICAuLi4odG9rZW4gPyB7IEF1dGhvcml6YXRpb246ICdCZWFyZXIgJyArIHRva2VuIH0gOiB7fSksXG4gICAgICAgICAgfSxcbiAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7fSksXG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjb25zb2xlLndhcm4oJ1tEcmVhbUNoYXRIb21lXSB0aHJlYWQgZGV0ZWN0IGZpbmFsaXplIGZhaWxlZDonLCBlPy5tZXNzYWdlKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG1zZy5jYXRlZ29yeSA9PT0gJ2VjaG9fZGV0ZWN0ZWQnKSB7XG4gICAgICAvLyAyMDI2LTA0LTI5IFx1MjAxNCBjb250ZXh0X2thaXJvc19pZHMgPSBba2Fpcm9zX2lkX3Bhc3NcdTAwRTksIGxpZmVfZW50cnlfaWRfcHJlc2VudF1cbiAgICAgIGNvbnN0IGlkcyA9IG1zZy5jb250ZXh0X2thaXJvc19pZHMgfHwgW107XG4gICAgICBjb25zdCBwYXN0S2Fpcm9zSWQgPSBpZHNbMF07XG4gICAgICBjb25zdCBwcmVzZW50RW50cnlJZCA9IGlkc1sxXTtcbiAgICAgIGlmIChwYXN0S2Fpcm9zSWQgJiYgdHlwZW9mIGdvID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGdvKCdrYWlyb3MnLCB7IGlkOiBwYXN0S2Fpcm9zSWQsIGVjaG9fd2l0aF9lbnRyeV9pZDogcHJlc2VudEVudHJ5SWQgfSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG1zZy5jYXRlZ29yeSA9PT0gJ3BhdHRlcm5fZW1lcmdpbmcnKSB7XG4gICAgICAvLyAyMDI2LTA0LTI5IFx1MjAxNCBGZWF0dXJlIDQgKGF1ZGl0IFQzIGZlcm1ldHVyZSkuIHBlbmRpbmdfcHJvYWN0aXZlX21lc3NhZ2VzXG4gICAgICAvLyBuJ2VtYmFycXVlIFBBUyBkZSBwYXR0ZXJuX2lkIGRpcmVjdCAoc2NoXHUwMEU5bWEgU1FMIG4nYSBxdWUgY29udGV4dF9rYWlyb3NfaWRzKS5cbiAgICAgIC8vIE9uIHJvdXRlIHZlcnMgbGEgbGlzdGUgZGVzIHBhdHRlcm5zIHJcdTAwRTljdXJyZW50cyBub24tYWNrbm93bGVkZ2VkIG9cdTAwRjkgdXNlclxuICAgICAgLy8gc1x1MDBFOWxlY3Rpb25uZXJhIGxlIG1vdGlmIGNvbmNlcm5cdTAwRTkuIFBhdHRlcm5MaXN0VmlldyByZWNvbm5hXHUwMEVFdCB0cmF1bWFfZmxhZ1xuICAgICAgLy8gZXQgcHJvcG9zZSBzYW5jdHVhaXJlIG91IHJlLWVudHJ5IGNvbnNjaWVudGUuXG4gICAgICBpZiAodHlwZW9mIGdvID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGdvKCdyZWN1cnJpbmcnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBDb25maXJtYXRpb24gaW5saW5lIHZpc2libGUgKHBhcyBwZXJzaXN0XHUwMEU5ZSBcdTIwMTQgbCdJQSBsZSB0aXNzZSBhdSBwcm9jaGFpbiBcdTAwRTljaGFuZ2UpXG4gICAgc2V0TWVzc2FnZXMoKHByZXYpID0+IFsuLi5wcmV2LCB7XG4gICAgICByb2xlOiAnYXNzaXN0YW50JyxcbiAgICAgIG1hdHRlcjogJ3NpbGsnLFxuICAgICAgY29udGVudDogbXNnLmNhdGVnb3J5ID09PSAndGhyZWFkX3Byb3Bvc2VkJ1xuICAgICAgICA/ICdCaWVuLiBMZSBmaWwgZXN0IG91dmVydC4gSmUgbGUgdGlzc2VyYWkgYXZlYyB0b2kgXHUwMEUwIG1lc3VyZSBxdWUgdHUgeSByZXZpZW5zLidcbiAgICAgICAgOiBtc2cuY2F0ZWdvcnkgPT09ICdlY2hvX2RldGVjdGVkJ1xuICAgICAgICAgID8gJ0JpZW4uIENcXCdlc3QgdG9pIHF1aSBzZW5zIHNpIGxcXCdcdTAwRTljaG8gZXN0IGp1c3RlIFx1MjAxNCBpbCBuXFwneSBhIHJpZW4gXHUwMEUwIGNvbmZpcm1lci4nXG4gICAgICAgICAgOiAnQmllbi4gQ1xcJ2VzdCBub3RcdTAwRTkuJyxcbiAgICAgIG1vZGU6ICduZXV0cmFsJyxcbiAgICAgIGNyZWF0ZWRfYXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICB9XSk7XG4gIH0sIFtyZXNwb25kUGVuZGluZywgZ29dKTtcblxuICAvLyAyXHVGRTBGXHUyMEUzIEF1dG8tc2Nyb2xsIGJvdHRvbSBvbiBuZXcgbWVzc2FnZXNcbiAgZGNFKCgpID0+IHtcbiAgICBpZiAoc2Nyb2xsUmVmLmN1cnJlbnQpIHtcbiAgICAgIHNjcm9sbFJlZi5jdXJyZW50LnNjcm9sbFRvcCA9IHNjcm9sbFJlZi5jdXJyZW50LnNjcm9sbEhlaWdodDtcbiAgICB9XG4gIH0sIFttZXNzYWdlcy5sZW5ndGgsIHN0cmVhbWluZ10pO1xuXG4gIC8vIDNcdUZFMEZcdTIwRTMgU2VuZCBtZXNzYWdlIHZpYSBTU0Ugc3RyZWFtaW5nLiBmb3JjZV9wb2x5cGhvbnk9dHJ1ZSBcdTIxOTIgZGVtYW5kZXIgXHUwMEUwIGxhIEZvclx1MDBFQXRcbiAgLy8gMjAyNi0wNC0yOCBcdTIwMTQgRFx1MDBFOXRlY3Rpb24gbWFya2VycyBsdWNpZGVzIChUMi42IGJyaWVmKS5cbiAgLy8gU2kgbGUgbWVzc2FnZSBjb250aWVudCB1biBtYXJrZXIgbHVjaWRlIEVUIHF1ZSB1c2VyIG4nYSBwYXMgYWN0aXZcdTAwRTkgbGEgc3ViLWFwcFxuICAvLyBFVCBxdSdvbiBuJ2EgcGFzIGRcdTAwRTlqXHUwMEUwIHByb3Bvc1x1MDBFOSBkYW5zIGxlcyA3IGRlcm5pZXJzIGpvdXJzIFx1MjE5MiBvbiBwcm9wb3NlIGVuXG4gIC8vIGRpYWxvZ3VlIEFuaW1hIGFwclx1MDBFOHMgbGEgclx1MDBFOXBvbnNlIG5vcm1hbGUgKGphbWFpcyBlbiBwdXNoIGludHJ1c2lmKS5cbiAgY29uc3QgTFVDSURfTUFSS0VSUyA9IFtcbiAgICAvXFxialsnZV0/XFxzKltcdTAwRTllXXRhaXM/XFxzK2x1Y2lkZVxcYi9pLFxuICAgIC9cXGJqWydhaV1cXHMqc3VcXHMrcXVlXFxzKyhqZVxccyspP3JbXHUwMEVBZV12YWlzP1xcYi9pLFxuICAgIC9cXGJyZWFsaXR5XFxzKmNoZWNrXFxiL2ksXG4gICAgL1xcYnJbXHUwMEVBZV12ZVxccytsdWNpZGVcXGIvaSxcbiAgICAvXFxiKFdCVEJ8TUlMRHxXSUxEfFNTSUxEfERJTEQpXFxiLyxcbiAgICAvXFxiZHJlYW1cXHMqc2lnbnM/XFxiL2ksXG4gICAgL1xcYm9uZWlyb25hdXRlP1xcYi9pLFxuICAgIC9cXGJqZVxccytyW1x1MDBFQWVddmFpc1xccysoZXR8ZW58cXVlKS4qamVcXHMrc2F2YWlzXFxiL2ksXG4gIF07XG4gIGNvbnN0IGRldGVjdEx1Y2lkTWFya2VyID0gKHRleHQpID0+IHtcbiAgICBpZiAoIXRleHQpIHJldHVybiBmYWxzZTtcbiAgICByZXR1cm4gTFVDSURfTUFSS0VSUy5zb21lKChyeCkgPT4gcngudGVzdCh0ZXh0KSk7XG4gIH07XG4gIGNvbnN0IHByb3Bvc2VMdWNpZFN1YmFwcCA9IGRjQ0IoKCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBsdWNpZEVuYWJsZWQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnZHJlYW06bHVjaWQ6ZW5hYmxlZCcpID09PSAndHJ1ZSc7XG4gICAgICBpZiAobHVjaWRFbmFibGVkKSByZXR1cm47XG4gICAgICBjb25zdCBsYXN0UHJvcG9zYWxBdCA9IHBhcnNlSW50KGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdkcmVhbTpsdWNpZDpicmlkZ2UtcHJvcG9zZWQtYXQnKSB8fCAnMCcsIDEwKTtcbiAgICAgIGlmIChEYXRlLm5vdygpIC0gbGFzdFByb3Bvc2FsQXQgPCA3ICogMjQgKiAzNjAwICogMTAwMCkgcmV0dXJuO1xuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2RyZWFtOmx1Y2lkOmJyaWRnZS1wcm9wb3NlZC1hdCcsIFN0cmluZyhEYXRlLm5vdygpKSk7XG4gICAgICAvLyBBam91dGUgdW4gbWVzc2FnZSBBbmltYSBkaXNjcmV0IGF2ZWMgQ1RBIGlubGluZVxuICAgICAgc2V0TWVzc2FnZXMoKHByZXYpID0+IFsuLi5wcmV2LCB7XG4gICAgICAgIHJvbGU6ICdhc3Npc3RhbnQnLFxuICAgICAgICBtb2RlOiAnbHVjaWRfYnJpZGdlJyxcbiAgICAgICAgY29udGVudDogJ1R1IHByYXRpcXVlcyBsZSByXHUwMEVBdmUgbHVjaWRlID8gSWwgeSBhIHVuZSBzb3VzLWFwcCBkXHUwMEU5ZGlcdTAwRTllIFx1MjAxNCA1IG9uZ2xldHMsIGFudGktaWF0cm9nXHUwMEU4bmUsIHBsYWZvbmRzIGV4cGxpY2l0ZXMuIFR1IHZldXggbGEgZFx1MDBFOWNvdXZyaXIgPycsXG4gICAgICAgIGN0YTogeyByb3V0ZTogJ2x1Y2lkLXByb2ZpbGUnLCBsYWJlbDogJ1x1MjcyNiBvdXZyaXIgTHVjaWQgRHJlYW1pbmcnIH0sXG4gICAgICAgIGNyZWF0ZWRfYXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgIH1dKTtcbiAgICB9IGNhdGNoIHt9XG4gIH0sIFtdKTtcblxuICBjb25zdCBzZW5kTWVzc2FnZSA9IGRjQ0IoYXN5bmMgKHRleHQsIG9wdGlvbnMgPSB7fSkgPT4ge1xuICAgIGNvbnN0IHsgZm9yY2VfcG9seXBob255ID0gZmFsc2UgfSA9IG9wdGlvbnM7XG4gICAgY29uc3QgdHJpbW1lZCA9ICh0ZXh0IHx8ICcnKS50cmltKCk7XG4gICAgaWYgKCF0cmltbWVkIHx8IHRoaW5raW5nKSByZXR1cm47XG4gICAgc2V0RXJyb3IoJycpO1xuICAgIHNldElucHV0KCcnKTtcbiAgICBzZXRNZXNzYWdlcygocHJldikgPT4gWy4uLnByZXYsIHsgcm9sZTogJ3VzZXInLCBjb250ZW50OiB0cmltbWVkLCBjcmVhdGVkX2F0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkgfV0pO1xuICAgIHNldFRoaW5raW5nKHRydWUpO1xuICAgIHNldFN0cmVhbWluZygnJyk7XG4gICAgc2V0U3RyZWFtaW5nTW9kZShudWxsKTtcbiAgICAvLyBEXHUwMEU5dGVjdGlvbiBsdWNpZGUgZW4gcGFyYWxsXHUwMEU4bGUgZGUgbGEgclx1MDBFOXBvbnNlIEFuaW1hXG4gICAgY29uc3QgaGFzTHVjaWRNYXJrZXIgPSBkZXRlY3RMdWNpZE1hcmtlcih0cmltbWVkKTtcblxuICAgIGxldCBidWZmZXIgPSAnJztcbiAgICBsZXQgcmVjZWl2ZWRNb2RlID0gbnVsbDtcbiAgICB0cnkge1xuICAgICAgY29uc3QgdG9rZW4gPSBhd2FpdCB3aW5kb3cuRHJlYW1BdXRoPy5nZXRBY2Nlc3NUb2tlbj8uKCk7XG4gICAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaCgnL2FwaS9kcmVhbS1jaGF0L2NvbnZlcnNlJywge1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgLi4uKHRva2VuID8geyBBdXRob3JpemF0aW9uOiAnQmVhcmVyICcgKyB0b2tlbiB9IDoge30pLFxuICAgICAgICB9LFxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IG1lc3NhZ2U6IHRyaW1tZWQsIGZvcmNlX3BvbHlwaG9ueSB9KSxcbiAgICAgIH0pO1xuICAgICAgaWYgKCFyZXMub2sgfHwgIXJlcy5ib2R5KSB0aHJvdyBuZXcgRXJyb3IoJ1BPU1QgZmFpbGVkOiAnICsgcmVzLnN0YXR1cyk7XG5cbiAgICAgIGNvbnN0IHJlYWRlciA9IHJlcy5ib2R5LmdldFJlYWRlcigpO1xuICAgICAgY29uc3QgZGVjb2RlciA9IG5ldyBUZXh0RGVjb2RlcigpO1xuICAgICAgbGV0IGxlZnRvdmVyID0gJyc7XG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICBjb25zdCB7IGRvbmUsIHZhbHVlIH0gPSBhd2FpdCByZWFkZXIucmVhZCgpO1xuICAgICAgICBpZiAoZG9uZSkgYnJlYWs7XG4gICAgICAgIGxlZnRvdmVyICs9IGRlY29kZXIuZGVjb2RlKHZhbHVlLCB7IHN0cmVhbTogdHJ1ZSB9KTtcbiAgICAgICAgY29uc3QgZXZlbnRzID0gbGVmdG92ZXIuc3BsaXQoJ1xcblxcbicpO1xuICAgICAgICBsZWZ0b3ZlciA9IGV2ZW50cy5wb3AoKSB8fCAnJztcbiAgICAgICAgZm9yIChjb25zdCBldnQgb2YgZXZlbnRzKSB7XG4gICAgICAgICAgaWYgKCFldnQuc3RhcnRzV2l0aCgnZGF0YTogJykpIGNvbnRpbnVlO1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBwYXlsb2FkID0gSlNPTi5wYXJzZShldnQuc2xpY2UoNikpO1xuICAgICAgICAgICAgaWYgKHBheWxvYWQudHlwZSA9PT0gJ21vZGUnKSB7XG4gICAgICAgICAgICAgIHJlY2VpdmVkTW9kZSA9IHBheWxvYWQubW9kZTtcbiAgICAgICAgICAgICAgc2V0U3RyZWFtaW5nTW9kZShwYXlsb2FkLm1vZGUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChwYXlsb2FkLnR5cGUgPT09ICdjaHVuaycpIHtcbiAgICAgICAgICAgICAgYnVmZmVyICs9IHBheWxvYWQudGV4dDtcbiAgICAgICAgICAgICAgc2V0U3RyZWFtaW5nKGJ1ZmZlcik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHBheWxvYWQudHlwZSA9PT0gJ2J1YmJsZScpIHtcbiAgICAgICAgICAgICAgLy8gXHUwMEE3MTEuYmlzLjIwLjkgXHUyMDE0IGJ1bGxlIE1BVFRFUiBkaXN0aW5jdGUgKHBhcGVyL3N0b25lL3NpbGspIHBvdXIgcG9seXBob25pZVxuICAgICAgICAgICAgICBzZXRNZXNzYWdlcygocHJldikgPT4gWy4uLnByZXYsIHtcbiAgICAgICAgICAgICAgICByb2xlOiAnYXNzaXN0YW50JyxcbiAgICAgICAgICAgICAgICBjb250ZW50OiBwYXlsb2FkLnRleHQsXG4gICAgICAgICAgICAgICAgbWF0dGVyOiBwYXlsb2FkLm1hdHRlcixcbiAgICAgICAgICAgICAgICB2b2ljZV9hdHRyaWJ1dGlvbjogcGF5bG9hZC52b2ljZV9hdHRyaWJ1dGlvbixcbiAgICAgICAgICAgICAgICBtb2RlOiAncG9seXBob255JyxcbiAgICAgICAgICAgICAgICBjcmVhdGVkX2F0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICAgICAgICAgIH1dKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocGF5bG9hZC50eXBlID09PSAnc2Vzc2lvbicpIHtcbiAgICAgICAgICAgICAgaWYgKHBheWxvYWQuc2Vzc2lvbl9pZCAmJiAoIXNlc3Npb24gfHwgc2Vzc2lvbi5pZCAhPT0gcGF5bG9hZC5zZXNzaW9uX2lkKSkge1xuICAgICAgICAgICAgICAgIHNldFNlc3Npb24oKHMpID0+ICh7IC4uLihzIHx8IHt9KSwgaWQ6IHBheWxvYWQuc2Vzc2lvbl9pZCwgcHJlc2VuY2VfbmFtZTogcGF5bG9hZC5wcmVzZW5jZV9uYW1lIH0pKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChwYXlsb2FkLnR5cGUgPT09ICdkb25lJykge1xuICAgICAgICAgICAgICBpZiAoYnVmZmVyKSB7XG4gICAgICAgICAgICAgICAgc2V0TWVzc2FnZXMoKHByZXYpID0+IFsuLi5wcmV2LCB7XG4gICAgICAgICAgICAgICAgICByb2xlOiAnYXNzaXN0YW50JyxcbiAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IGJ1ZmZlcixcbiAgICAgICAgICAgICAgICAgIG1vZGU6IHJlY2VpdmVkTW9kZSxcbiAgICAgICAgICAgICAgICAgIGNyZWF0ZWRfYXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICB9XSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgc2V0U3RyZWFtaW5nKCcnKTtcbiAgICAgICAgICAgICAgc2V0U3RyZWFtaW5nTW9kZShudWxsKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocGF5bG9hZC50eXBlID09PSAnZXJyb3InKSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihwYXlsb2FkLmVycm9yIHx8ICdzdHJlYW1pbmcgZXJyb3InKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGNhdGNoIChwYXJzZUVycikge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdbRHJlYW1DaGF0SG9tZV0gZXZlbnQgcGFyc2UgZmFpbGVkOicsIHBhcnNlRXJyLm1lc3NhZ2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUud2FybignW0RyZWFtQ2hhdEhvbWVdIHNlbmRNZXNzYWdlIGZhaWxlZDonLCBlLm1lc3NhZ2UpO1xuICAgICAgc2V0RXJyb3IoJ0xhIHByXHUwMEU5c2VuY2UgblxcJ2EgcGFzIHJcdTAwRTlwb25kdS4gUlx1MDBFOWVzc2FpZS4nKTtcbiAgICAgIHNldE1lc3NhZ2VzKChwcmV2KSA9PiBbLi4ucHJldiwge1xuICAgICAgICByb2xlOiAnYXNzaXN0YW50JyxcbiAgICAgICAgY29udGVudDogJ1F1ZWxxdWUgY2hvc2Ugc1xcJ2VzdCBjYXNzXHUwMEU5IGRhbnMgbGUgdGlzc2FnZS4gVHUgcGV1eCByXHUwMEU5ZXNzYXllci4nLFxuICAgICAgICBtb2RlOiAnbmV1dHJhbCcsXG4gICAgICAgIGNyZWF0ZWRfYXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgIH1dKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgc2V0VGhpbmtpbmcoZmFsc2UpO1xuICAgICAgLy8gQnJpZGdlIEx1Y2lkIChUMi42KSBcdTIwMTQgc2kgbWFya2VyIGRcdTAwRTl0ZWN0XHUwMEU5IGV0IGNvbmRpdGlvbnMgT0ssIHByb3Bvc2UgZW5cbiAgICAgIC8vIGRpYWxvZ3VlIEFuaW1hIDgwMG1zIGFwclx1MDBFOHMgbGEgZmluIHBvdXIgbGFpc3NlciByZXNwaXJlci5cbiAgICAgIGlmIChoYXNMdWNpZE1hcmtlcikge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHByb3Bvc2VMdWNpZFN1YmFwcCgpLCA4MDApO1xuICAgICAgfVxuICAgIH1cbiAgfSwgW3RoaW5raW5nLCBzZXNzaW9uLCBwcm9wb3NlTHVjaWRTdWJhcHBdKTtcblxuICAvLyAzLmJpcyBcdTIwMTQgQ29udm9xdWVyIGxhIEZvclx1MDBFQXQgKHBvbHlwaG9uaWUgMyB2b2l4IHBhcGVyL3N0b25lL3NpbGspXG4gIGNvbnN0IGNhbGxGb3Jlc3QgPSBkY0NCKCgpID0+IHtcbiAgICBpZiAodGhpbmtpbmcgfHwgIWlucHV0LnRyaW0oKSkge1xuICAgICAgLy8gU2kgcGFzIGRlIHRleHRlLCBvbiBjb252b3F1ZSBzdXIgbGUgZGVybmllciBtZXNzYWdlIHVzZXJcbiAgICAgIGNvbnN0IGxhc3RVc2VyID0gWy4uLm1lc3NhZ2VzXS5yZXZlcnNlKCkuZmluZCgobSkgPT4gbS5yb2xlID09PSAndXNlcicpO1xuICAgICAgaWYgKGxhc3RVc2VyKSBzZW5kTWVzc2FnZShsYXN0VXNlci5jb250ZW50LCB7IGZvcmNlX3BvbHlwaG9ueTogdHJ1ZSB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgc2VuZE1lc3NhZ2UoaW5wdXQsIHsgZm9yY2VfcG9seXBob255OiB0cnVlIH0pO1xuICB9LCBbdGhpbmtpbmcsIGlucHV0LCBtZXNzYWdlcywgc2VuZE1lc3NhZ2VdKTtcblxuICAvLyA0XHVGRTBGXHUyMEUzIFZvaWNlIGlucHV0IHJcdTAwRTllbCBcdTIwMTQgQS43K0IuMSAoTWVkaWFSZWNvcmRlciArIFdoaXNwZXIgL2FwaS90cmFuc2NyaWJlKVxuICBjb25zdCByZWNvcmRlclJlZiA9IGRjUihudWxsKTtcbiAgY29uc3QgYXVkaW9DaHVua3NSZWYgPSBkY1IoW10pO1xuICBjb25zdCBzdHJlYW1SZWYgPSBkY1IobnVsbCk7XG4gIGNvbnN0IFt0cmFuc2NyaWJpbmcsIHNldFRyYW5zY3JpYmluZ10gPSBkY1MoZmFsc2UpO1xuXG4gIGNvbnN0IHN0YXJ0UmVjb3JkaW5nID0gZGNDQihhc3luYyAoKSA9PiB7XG4gICAgaWYgKHJlY29yZGVyUmVmLmN1cnJlbnQpIHJldHVybjsgLy8gZFx1MDBFOWpcdTAwRTAgZW4gY291cnNcbiAgICB0cnkge1xuICAgICAgY29uc3Qgc3RyZWFtID0gYXdhaXQgbmF2aWdhdG9yLm1lZGlhRGV2aWNlcy5nZXRVc2VyTWVkaWEoeyBhdWRpbzogdHJ1ZSB9KTtcbiAgICAgIHN0cmVhbVJlZi5jdXJyZW50ID0gc3RyZWFtO1xuICAgICAgYXVkaW9DaHVua3NSZWYuY3VycmVudCA9IFtdO1xuICAgICAgY29uc3QgbWltZSA9IE1lZGlhUmVjb3JkZXIuaXNUeXBlU3VwcG9ydGVkKCdhdWRpby93ZWJtO2NvZGVjcz1vcHVzJylcbiAgICAgICAgPyAnYXVkaW8vd2VibTtjb2RlY3M9b3B1cydcbiAgICAgICAgOiBNZWRpYVJlY29yZGVyLmlzVHlwZVN1cHBvcnRlZCgnYXVkaW8vbXA0JylcbiAgICAgICAgICA/ICdhdWRpby9tcDQnXG4gICAgICAgICAgOiAnYXVkaW8vd2VibSc7XG4gICAgICBjb25zdCByZWMgPSBuZXcgTWVkaWFSZWNvcmRlcihzdHJlYW0sIHsgbWltZVR5cGU6IG1pbWUgfSk7XG4gICAgICByZWMub25kYXRhYXZhaWxhYmxlID0gKGUpID0+IHsgaWYgKGUuZGF0YS5zaXplID4gMCkgYXVkaW9DaHVua3NSZWYuY3VycmVudC5wdXNoKGUuZGF0YSk7IH07XG4gICAgICByZWMuc3RhcnQoMjUwKTsgLy8gXHUwMEU5bWV0IGNodW5rIGV2ZXJ5IDI1MG1zXG4gICAgICByZWNvcmRlclJlZi5jdXJyZW50ID0gcmVjO1xuICAgICAgc2V0UmVjb3JkaW5nKHRydWUpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUud2FybignW0RyZWFtQ2hhdEhvbWVdIG1pYyBwZXJtaXNzaW9uIGRlbmllZDonLCBlLm1lc3NhZ2UpO1xuICAgICAgc2V0RXJyb3IoZS5uYW1lID09PSAnTm90QWxsb3dlZEVycm9yJ1xuICAgICAgICA/ICdQZXJtaXNzaW9uIG1pY3JvIHJlZnVzXHUwMEU5ZS4gQWN0aXZlLWxhIGRhbnMgdG9uIG5hdmlnYXRldXIuJ1xuICAgICAgICA6ICdJbXBvc3NpYmxlIGRcXCdhY2NcdTAwRTlkZXIgYXUgbWljcm8uJyk7XG4gICAgICBzZXRSZWNvcmRpbmcoZmFsc2UpO1xuICAgICAgc2V0TG9ja2VkKGZhbHNlKTtcbiAgICB9XG4gIH0sIFtdKTtcblxuICBjb25zdCBzdG9wUmVjb3JkaW5nID0gZGNDQihhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgcmVjID0gcmVjb3JkZXJSZWYuY3VycmVudDtcbiAgICBjb25zdCBzdHJlYW0gPSBzdHJlYW1SZWYuY3VycmVudDtcbiAgICBpZiAoIXJlYykgcmV0dXJuIG51bGw7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgIHJlYy5vbnN0b3AgPSBhc3luYyAoKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKHN0cmVhbSkgc3RyZWFtLmdldFRyYWNrcygpLmZvckVhY2goKHQpID0+IHQuc3RvcCgpKTtcbiAgICAgICAgICBzdHJlYW1SZWYuY3VycmVudCA9IG51bGw7XG4gICAgICAgICAgcmVjb3JkZXJSZWYuY3VycmVudCA9IG51bGw7XG4gICAgICAgICAgc2V0UmVjb3JkaW5nKGZhbHNlKTtcblxuICAgICAgICAgIGlmIChhdWRpb0NodW5rc1JlZi5jdXJyZW50Lmxlbmd0aCA9PT0gMCkgeyByZXNvbHZlKG51bGwpOyByZXR1cm47IH1cbiAgICAgICAgICBjb25zdCBibG9iID0gbmV3IEJsb2IoYXVkaW9DaHVua3NSZWYuY3VycmVudCwgeyB0eXBlOiByZWMubWltZVR5cGUgfHwgJ2F1ZGlvL3dlYm0nIH0pO1xuICAgICAgICAgIGF1ZGlvQ2h1bmtzUmVmLmN1cnJlbnQgPSBbXTtcbiAgICAgICAgICBpZiAoYmxvYi5zaXplIDwgNTAwKSB7IHJlc29sdmUobnVsbCk7IHJldHVybjsgfSAvLyB0cm9wIGNvdXJ0XG5cbiAgICAgICAgICAvLyBVcGxvYWQgdG8gL2FwaS90cmFuc2NyaWJlXG4gICAgICAgICAgc2V0VHJhbnNjcmliaW5nKHRydWUpO1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB0b2tlbiA9IGF3YWl0IHdpbmRvdy5EcmVhbUF1dGg/LmdldEFjY2Vzc1Rva2VuPy4oKTtcbiAgICAgICAgICAgIGNvbnN0IGZkID0gbmV3IEZvcm1EYXRhKCk7XG4gICAgICAgICAgICBmZC5hcHBlbmQoJ2F1ZGlvJywgbmV3IEZpbGUoW2Jsb2JdLCAndm9pY2Uud2VibScsIHsgdHlwZTogYmxvYi50eXBlIH0pKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKCcvYXBpL3RyYW5zY3JpYmUnLCB7XG4gICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgICBoZWFkZXJzOiB0b2tlbiA/IHsgQXV0aG9yaXphdGlvbjogJ0JlYXJlciAnICsgdG9rZW4gfSA6IHt9LFxuICAgICAgICAgICAgICBib2R5OiBmZCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKCFyZXMub2spIHRocm93IG5ldyBFcnJvcigndHJhbnNjcmliZSAnICsgcmVzLnN0YXR1cyk7XG4gICAgICAgICAgICBjb25zdCBqc29uID0gYXdhaXQgcmVzLmpzb24oKTtcbiAgICAgICAgICAgIGNvbnN0IHRyYW5zY3JpcHQgPSAoanNvbi50ZXh0IHx8IGpzb24udHJhbnNjcmlwdCB8fCAnJykudHJpbSgpO1xuICAgICAgICAgICAgaWYgKHRyYW5zY3JpcHQpIHtcbiAgICAgICAgICAgICAgc2V0SW5wdXQoKHByZXYpID0+IChwcmV2ID8gcHJldiArICcgJyA6ICcnKSArIHRyYW5zY3JpcHQpO1xuICAgICAgICAgICAgICBpZiAodGFSZWYuY3VycmVudCkgdGFSZWYuY3VycmVudC5mb2N1cygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzb2x2ZSh0cmFuc2NyaXB0KTtcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1tEcmVhbUNoYXRIb21lXSB0cmFuc2NyaWJlIGZhaWxlZDonLCBlLm1lc3NhZ2UpO1xuICAgICAgICAgICAgc2V0RXJyb3IoJ1RyYW5zY3JpcHRpb24gXHUwMEU5Y2hvdVx1MDBFOWUuIFJcdTAwRTllc3NhaWUgb3UgdGFwZSBhdSBjbGF2aWVyLicpO1xuICAgICAgICAgICAgcmVzb2x2ZShudWxsKTtcbiAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgc2V0VHJhbnNjcmliaW5nKGZhbHNlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBjb25zb2xlLndhcm4oJ1tEcmVhbUNoYXRIb21lXSBzdG9wIGhhbmRsZXIgZmFpbGVkOicsIGUubWVzc2FnZSk7XG4gICAgICAgICAgcmVzb2x2ZShudWxsKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHJlYy5zdG9wKCk7XG4gICAgfSk7XG4gIH0sIFtdKTtcblxuICBjb25zdCBvblNob3J0VGFwID0gKCkgPT4ge1xuICAgIGlmICh0YVJlZi5jdXJyZW50KSB0YVJlZi5jdXJyZW50LmZvY3VzKCk7XG4gIH07XG4gIGNvbnN0IG9uUHVzaFN0YXJ0ID0gZGNDQigoKSA9PiB7XG4gICAgaWYgKHRyYW5zY3JpYmluZyB8fCB0aGlua2luZykgcmV0dXJuO1xuICAgIHN0YXJ0UmVjb3JkaW5nKCk7XG4gIH0sIFtzdGFydFJlY29yZGluZywgdHJhbnNjcmliaW5nLCB0aGlua2luZ10pO1xuICBjb25zdCBvblB1c2hFbmQgPSBkY0NCKCgpID0+IHtcbiAgICBpZiAobG9ja2VkKSByZXR1cm47IC8vIHNpIGxvY2sgYWN0aWYsIGwndXRpbGlzYXRldXIgc3RvcHBlcmEgdmlhIG9uTG9ja1RvZ2dsZShmYWxzZSlcbiAgICBzdG9wUmVjb3JkaW5nKCk7XG4gIH0sIFtzdG9wUmVjb3JkaW5nLCBsb2NrZWRdKTtcbiAgY29uc3Qgb25Mb2NrVG9nZ2xlID0gZGNDQigobmV4dCkgPT4ge1xuICAgIHNldExvY2tlZCghIW5leHQpO1xuICAgIGlmICghbmV4dCkge1xuICAgICAgLy8gdW5sb2NrID0gc3RvcCByZWNvcmRpbmcgKHZpYSBvbkxvY2tUb2dnbGUoZmFsc2UpIGRcdTAwRTljbGVuY2hcdTAwRTkgcGFyIHRhcCBzdXIgb3JiZSBlbiBtb2RlIGxvY2tlZClcbiAgICAgIHN0b3BSZWNvcmRpbmcoKTtcbiAgICB9XG4gIH0sIFtzdG9wUmVjb3JkaW5nXSk7XG5cbiAgLy8gQ2xlYW51cCBvbiB1bm1vdW50XG4gIGRjRSgoKSA9PiAoKSA9PiB7XG4gICAgdHJ5IHsgcmVjb3JkZXJSZWYuY3VycmVudD8uc3RvcCgpOyB9IGNhdGNoIHt9XG4gICAgdHJ5IHsgc3RyZWFtUmVmLmN1cnJlbnQ/LmdldFRyYWNrcygpLmZvckVhY2goKHQpID0+IHQuc3RvcCgpKTsgfSBjYXRjaCB7fVxuICB9LCBbXSk7XG5cbiAgLy8gNVx1RkUwRlx1MjBFMyBVcGRhdGUgcHJlc2VuY2VfbmFtZSBhcHJcdTAwRThzIG5hbWluZ1xuICBjb25zdCBvbkNvbmZpcm1OYW1pbmcgPSBhc3luYyAobmFtZSkgPT4ge1xuICAgIHNldFNob3dOYW1pbmcoZmFsc2UpO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCB0b2tlbiA9IGF3YWl0IHdpbmRvdy5EcmVhbUF1dGg/LmdldEFjY2Vzc1Rva2VuPy4oKTtcbiAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKCcvYXBpL2RyZWFtLWNoYXQvY29udmVyc2UnLCB7XG4gICAgICAgIG1ldGhvZDogJ1BBVENIJyxcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgLi4uKHRva2VuID8geyBBdXRob3JpemF0aW9uOiAnQmVhcmVyICcgKyB0b2tlbiB9IDoge30pLFxuICAgICAgICB9LFxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IHByZXNlbmNlX25hbWU6IG5hbWUgfSksXG4gICAgICB9KTtcbiAgICAgIGlmIChyZXMub2spIHtcbiAgICAgICAgY29uc3QganNvbiA9IGF3YWl0IHJlcy5qc29uKCk7XG4gICAgICAgIGlmIChqc29uLnNlc3Npb24pIHNldFNlc3Npb24oanNvbi5zZXNzaW9uKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1tEcmVhbUNoYXRIb21lXSBuYW1pbmcgUEFUQ0ggZmFpbGVkOicsIGUubWVzc2FnZSk7XG4gICAgfVxuICAgIC8vIFByZW1pZXIgbWVzc2FnZSBkJ2FjY3VlaWwgZGUgbGEgcHJcdTAwRTlzZW5jZSAoY1x1MDBGNHRcdTAwRTkgY2xpZW50LCBwYXMgcGVyc2lzdFx1MDBFOSlcbiAgICBjb25zdCBncmVldGluZyA9IGBCb25qb3VyLiBKZSBzdWlzICR7bmFtZX0gXHUyMDE0IGxhIHByXHUwMEU5c2VuY2UgcXVpIHZhIHQnYWNjb21wYWduZXIgaWNpLlxcblxcbkplIGNvbm5haXMgY2UgcXVlIHR1IGRcdTAwRTlwb3Nlcy4gSmUgdGlzc2UgbGVzIGxpZW5zIGVudHJlIHRlcyByXHUwMEVBdmVzLCB0ZXMgc2lnbmVzIGRpdXJuZXMsIHRvbiBjb3JwcywgdGVzIHNhaXNvbnMuIEplIGNvbnZvcXVlIGxhIEZvclx1MDBFQXQgKDMzMysgbGl2cmVzIGRpZ1x1MDBFOXJcdTAwRTlzKSBxdWFuZCB0dSB2ZXV4IGRlcyBhbmdsZXMuXFxuXFxuUGFzIHBvdXIgdGUgZGlyZSBjZSBxdWUgXHUwMEU3YSB2ZXV0IGRpcmUuIFBvdXIgdCdhaWRlciBcdTAwRTAgbGUgZFx1MDBFOWNvdXZyaXIgdG9pLW1cdTAwRUFtZS5cXG5cXG5UdSBwZXV4IG1lIHBhcmxlciBcdTAwRTAgdm9peCBvdSBhdSBjbGF2aWVyLiBUdSBwZXV4IHRvdXQgZFx1MDBFOXBvc2VyIGljaSwgamUgY29tcHJlbmRyYWkuXFxuXFxuUXUnZXN0LWNlIHF1aSB2aWVudCA/YDtcbiAgICBzZXRNZXNzYWdlcygocHJldikgPT4gWy4uLnByZXYsIHtcbiAgICAgIHJvbGU6ICdhc3Npc3RhbnQnLFxuICAgICAgY29udGVudDogZ3JlZXRpbmcsXG4gICAgICBtb2RlOiAnbmV1dHJhbCcsXG4gICAgICBjcmVhdGVkX2F0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgfV0pO1xuICB9O1xuXG4gIGNvbnN0IHByZXNlbmNlTmFtZSA9IHNlc3Npb24/LnByZXNlbmNlX25hbWUgfHwgJ0FuaW1hJztcblxuICAvLyBcdTAwQTcxMS5iaXMuMjAuMTQgKyBBLjggXHUyMDE0IEhhbG8gYXRtb3NwaFx1MDBFOXJpcXVlIHNlbG9uIG1vZGUgY291cmFudCAodmlzaWJsZSB2aXN1ZWxsZW1lbnQpXG4gIC8vIE1vZGUgZXN0IGRcdTAwRTl0ZWN0XHUwMEU5IGNcdTAwRjR0XHUwMEU5IGJhY2tlbmQgbWFpcyBvbiBwclx1MDBFOWRpdCBjXHUwMEY0dFx1MDBFOSBjbGllbnQgcG91ciBlZmZldCBpbW1cdTAwRTlkaWF0XG4gIGNvbnN0IGN1cnJlbnRNb2RlID0gZGNNKCgpID0+IHtcbiAgICBpZiAoc3RyZWFtaW5nTW9kZSkgcmV0dXJuIHN0cmVhbWluZ01vZGU7XG4gICAgY29uc3QgaCA9IG5ldyBEYXRlKCkuZ2V0SG91cnMoKTtcbiAgICBpZiAoaCA+PSAyMSB8fCBoIDwgMSkgcmV0dXJuICdwcmVfc2xlZXAnO1xuICAgIGlmIChoID49IDUgJiYgaCA8IDkpIHJldHVybiAnbW9ybmluZyc7XG4gICAgaWYgKGggPj0gOSAmJiBoIDwgMTQpIHJldHVybiAnZGF5JztcbiAgICBpZiAoaCA+PSAxNCAmJiBoIDwgMTgpIHJldHVybiAncmV2ZXJpZSc7XG4gICAgaWYgKGggPj0gMTggJiYgaCA8IDIxKSByZXR1cm4gJ2V2ZW5pbmcnO1xuICAgIHJldHVybiAnbmV1dHJhbCc7XG4gIH0sIFtzdHJlYW1pbmdNb2RlXSk7XG5cbiAgLy8gMjAyNi0wNC0zMCBcdTIwMTQgb3BhY2l0XHUwMEU5cyByZXZ1ZXMgXHUwMEUwIGxhIGhhdXNzZSAoYXVkaXQgQVVESVQtTU9CSUxFLUFOSU1BVElPTlMtTElWRS5tZFxuICAvLyBcdTAwQTcyLkMgOiAwLjE4ID0gcXVhc2kgaW52aXNpYmxlKS4gTXVsdGlwbGljYXRpb24gXHUwMEQ3MS42IHBvdXIgdmlzaWJpbGl0XHUwMEU5IGhvbm5cdTAwRUF0ZS5cbiAgLy8gU2kgZm9jdXMgdGV4dGFyZWEgXHUyMTkyIGJvb3N0IFx1MDBENzEuNCBzdXBwbFx1MDBFOW1lbnRhaXJlIChsZSB1c2VyIFwiclx1MDBFOXZlaWxsZVwiIGxhIHByXHUwMEU5c2VuY2UpLlxuICBjb25zdCBoYWxvQnlNb2RlID0ge1xuICAgIHByZV9zbGVlcDogeyBjb2xvcjogJ29rbGNoKDAuNTUgMC4xMiA1MCknLCBvcGFjaXR5OiAwLjMwLCBzcHJlYWQ6ICc2MCUgNDAlJyB9LFxuICAgIG1vcm5pbmc6IHsgY29sb3I6ICdva2xjaCgwLjc4IDAuMTAgNzApJywgb3BhY2l0eTogMC4zNiwgc3ByZWFkOiAnNzAlIDMwJScgfSxcbiAgICBkYXk6IHsgY29sb3I6ICdva2xjaCgwLjY1IDAuMDggNjUpJywgb3BhY2l0eTogMC4yMiwgc3ByZWFkOiAnNTAlIDUwJScgfSxcbiAgICByZXZlcmllOiB7IGNvbG9yOiAnb2tsY2goMC42MiAwLjEzIDI4MCknLCBvcGFjaXR5OiAwLjI2LCBzcHJlYWQ6ICc2MCUgNDAlJyB9LFxuICAgIGV2ZW5pbmc6IHsgY29sb3I6ICdva2xjaCgwLjUwIDAuMTQgMzUpJywgb3BhY2l0eTogMC4zMiwgc3ByZWFkOiAnNzAlIDM1JScgfSxcbiAgICBuZXV0cmFsOiB7IGNvbG9yOiAnb2tsY2goMC41NSAwLjEwIDYwKScsIG9wYWNpdHk6IDAuMjAsIHNwcmVhZDogJzUwJSA0MCUnIH0sXG4gICAgcG9seXBob255OiB7IGNvbG9yOiAnb2tsY2goMC43MCAwLjE2IDcwKScsIG9wYWNpdHk6IDAuNDIsIHNwcmVhZDogJzYwJSA1MCUnIH0sXG4gICAgY3Jpc2lzX3NhZmU6IHsgY29sb3I6ICdva2xjaCgwLjQwIDAuMDQgMzApJywgb3BhY2l0eTogMC4zOCwgc3ByZWFkOiAnNDAlIDMwJScgfSxcbiAgfTtcbiAgY29uc3QgaGFsbyA9IGhhbG9CeU1vZGVbY3VycmVudE1vZGVdIHx8IGhhbG9CeU1vZGUubmV1dHJhbDtcbiAgY29uc3QgaGFsb09wYWNpdHkgPSB0YUZvY3VzZWQgPyBNYXRoLm1pbigwLjU1LCBoYWxvLm9wYWNpdHkgKiAxLjQpIDogaGFsby5vcGFjaXR5O1xuXG4gIC8vIDIwMjYtMDQtMzAgXHUyMDE0IGdseXBoZSBjb250ZXh0dWVsIHNlbG9uIG1vZGUgKFllc2h1YSBhbXBsaSlcbiAgLy8gUHJcdTAwRTktc29tbWVpbC9zb2lyIFx1MjE5MiBjcm9pc3NhbnQgbHVuYWlyZSA7IG1hdGluIFx1MjE5MiBkZW1pLWNlcmNsZSBhdXJvcmUgO1xuICAvLyBqb3VyIFx1MjE5MiB0cmlhbmdsZSAocml0dWVsIGRpdXJuZSkgOyByZXZlcmllIFx1MjE5MiBzcGlyYWxlIChkXHUwMEU5alx1MDBFMCBleGlzdGFudGUgY2VudHJcdTAwRTllIG9yYmUpLlxuICBjb25zdCBnbHlwaEJ5TW9kZSA9IHtcbiAgICBwcmVfc2xlZXA6IHsga2luZDogJ2Nyb2lzc2FudCcsIHNpemU6IDY0LCBvcGFjaXR5OiAwLjIyLCB0b3A6ICcxMiUnLCBwb3NpdGlvbjogJ3RvcC1sZWZ0JyB9LFxuICAgIGV2ZW5pbmc6IHsga2luZDogJ2Nyb2lzc2FudCcsIHNpemU6IDU2LCBvcGFjaXR5OiAwLjIwLCB0b3A6ICcxNCUnLCBwb3NpdGlvbjogJ3RvcC1sZWZ0JyB9LFxuICAgIG1vcm5pbmc6IHsga2luZDogJ2RlbWktY2VyY2xlJywgc2l6ZTogJ3dpZGUnLCBvcGFjaXR5OiAwLjI4LCB0b3A6ICc2JScsIHBvc2l0aW9uOiAndG9wLXdpZGUnIH0sXG4gICAgZGF5OiB7IGtpbmQ6ICd0cmlhbmdsZScsIHNpemU6IDUwLCBvcGFjaXR5OiAwLjE2LCB0b3A6ICcxMCUnLCBwb3NpdGlvbjogJ3RvcC1yaWdodCcgfSxcbiAgICByZXZlcmllOiBudWxsLCAvLyBzcGlyYWxlIGRcdTAwRTlqXHUwMEUwIGNlbnRyXHUwMEU5ZSBkZXJyaVx1MDBFOHJlIGwnb3JiZVxuICAgIG5ldXRyYWw6IG51bGwsXG4gICAgcG9seXBob255OiBudWxsLCAvLyBidWxsZXMgZm9udCBsZSB0cmF2YWlsXG4gICAgY3Jpc2lzX3NhZmU6IG51bGwsIC8vIHNvYnJlLCBwYXMgZGUgZ2x5cGhlXG4gIH07XG4gIGNvbnN0IGN0eEdseXBoID0gZ2x5cGhCeU1vZGVbY3VycmVudE1vZGVdO1xuXG4gIC8vIDIwMjYtMDQtMzAgXHUyMDE0IG1hdHRlciBhdG1vc3BoXHUwMEU5cmlxdWUgc2Vsb24gbW9kZSAoWWVzaHVhIGFtcGxpKVxuICAvLyBFbiBwb2x5cGhvbmllIGFjdGl2ZSA6IHNpbGsgc3VidGlsLiBQclx1MDBFOS1zb21tZWlsIDogc2lsayBkb3V4LiBDcmlzaXMtc2FmZSA6IHN0b25lLlxuICBjb25zdCBtYXR0ZXJCeU1vZGUgPSB7XG4gICAgcHJlX3NsZWVwOiAnc2lsaycsXG4gICAgZXZlbmluZzogJ3NpbGsnLFxuICAgIG1vcm5pbmc6ICdwYXBlcicsXG4gICAgZGF5OiAncGFwZXInLFxuICAgIHJldmVyaWU6ICdzaWxrJyxcbiAgICBwb2x5cGhvbnk6ICdzaWxrJyxcbiAgICBjcmlzaXNfc2FmZTogJ3N0b25lJyxcbiAgICBuZXV0cmFsOiBudWxsLFxuICB9O1xuICBjb25zdCBjdHhNYXR0ZXIgPSBtYXR0ZXJCeU1vZGVbY3VycmVudE1vZGVdO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJzdGFnZSBzY3JlZW4tZW50ZXJcIiBzdHlsZT17e1xuICAgICAgYmFja2dyb3VuZDogJ3ZhcigtLW5pZ2h0LWZsb29yKScsXG4gICAgICBtaW5IZWlnaHQ6ICcxMDB2aCcsXG4gICAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyxcbiAgICAgIHBhZGRpbmdCb3R0b206ICdjYWxjKGVudihzYWZlLWFyZWEtaW5zZXQtYm90dG9tLCAwcHgpICsgMTEwcHgpJyxcbiAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nLFxuICAgIH19PlxuICAgICAgey8qIDIwMjYtMDQtMzAgXHUyMDE0IFN1cmZhY2UgbWF0dGVyIGF0bW9zcGhcdTAwRTlyaXF1ZSBlbiBCQUNLR1JPVU5EIEFCU09MVVxuICAgICAgICAgIChZZXNodWEgYW1wbGlmaWNhdGlvbiBcdTAwQTcxMS5iaXMuMjAuMjApLiBQb3NlIHVuIGJlZCBwYXBlci9zaWxrL3N0b25lXG4gICAgICAgICAgc2Vsb24gY29udGV4dGUgYXZlYyBvcGFjaXR5IGRvdWNlIFx1MjAxNCBkb25uZSB1bmUgcHJcdTAwRTlzZW5jZSB2aXZhbnRlIGF1XG4gICAgICAgICAgZm9uZCBkdSBjaGF0IHNhbnMgc3VyY2hhcmdlLiBOb3RlIDogc2kgbCdhZ2VudCAjMSBhIHBvc1x1MDBFOSB1blxuICAgICAgICAgIEhhbG9SZXNwaXJlIGdsb2JhbCBkYW5zIGFwcC5qc3gsIGNldHRlIFN1cmZhY2Ugc2UgY3VtdWxlIHNhbnNcbiAgICAgICAgICBjb25mbGl0IChTdXJmYWNlID0gYmVkICsgbm9pc2UsIEhhbG9SZXNwaXJlID0gcmVzcGlyYXRpb24gcmFkaWFsZSkuICovfVxuICAgICAge2N0eE1hdHRlciAmJiB3aW5kb3cuU3VyZmFjZSAmJiAoXG4gICAgICAgIDxkaXYgYXJpYS1oaWRkZW49XCJ0cnVlXCIgc3R5bGU9e3tcbiAgICAgICAgICBwb3NpdGlvbjogJ2ZpeGVkJywgaW5zZXQ6IDAsXG4gICAgICAgICAgb3BhY2l0eTogMC4yMixcbiAgICAgICAgICBwb2ludGVyRXZlbnRzOiAnbm9uZScsXG4gICAgICAgICAgekluZGV4OiAwLFxuICAgICAgICAgIHRyYW5zaXRpb246ICdvcGFjaXR5IDEuNnMgZWFzZS1pbi1vdXQnLFxuICAgICAgICB9fT5cbiAgICAgICAgICA8d2luZG93LlN1cmZhY2UgbWF0dGVyPXtjdHhNYXR0ZXJ9IG1vdGlvbj17dHJ1ZX1cbiAgICAgICAgICAgIHN0eWxlPXt7IHBvc2l0aW9uOiAnYWJzb2x1dGUnLCBpbnNldDogMCwgd2lkdGg6ICcxMDAlJywgaGVpZ2h0OiAnMTAwJScgfX0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuXG4gICAgICB7LyogXHUwMEE3MTEuYmlzLjIwLjE0ICsgQS44IFx1MjAxNCBIYWxvIGF0bW9zcGhcdTAwRTlyaXF1ZSBtb2RlLWF3YXJlICh0cmFuc2l0aW9uIDEuNnMgZG91Y2UpXG4gICAgICAgICAgMjAyNi0wNC0zMCBhbXBsaWZpY2F0aW9uIDogb3BhY2l0XHUwMEU5cyByZXZ1ZXMgKGNmLiBoYWxvQnlNb2RlKSwgYm9vc3QgXHUwMEQ3MS40IGF1XG4gICAgICAgICAgZm9jdXMgdGV4dGFyZWEgcG91ciBlZmZldCBcInByXHUwMEU5c2VuY2UgcXVpIHMnXHUwMEU5dmVpbGxlIHF1YW5kIHR1IGx1aSBwYXJsZXNcIi4gKi99XG4gICAgICA8ZGl2IGFyaWEtaGlkZGVuPVwidHJ1ZVwiIHN0eWxlPXt7XG4gICAgICAgIHBvc2l0aW9uOiAnZml4ZWQnLFxuICAgICAgICB0b3A6ICcyMHZoJywgbGVmdDogJzUwJScsXG4gICAgICAgIHdpZHRoOiAnOTB2dycsIGhlaWdodDogJzYwdmgnLFxuICAgICAgICBtYXhXaWR0aDogNzIwLFxuICAgICAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKC01MCUpJyxcbiAgICAgICAgYmFja2dyb3VuZDogYHJhZGlhbC1ncmFkaWVudChlbGxpcHNlICR7aGFsby5zcHJlYWR9IGF0IGNlbnRlciwgJHtoYWxvLmNvbG9yfSAwJSwgdHJhbnNwYXJlbnQgNzAlKWAsXG4gICAgICAgIG9wYWNpdHk6IGhhbG9PcGFjaXR5LFxuICAgICAgICBwb2ludGVyRXZlbnRzOiAnbm9uZScsXG4gICAgICAgIHRyYW5zaXRpb246ICdvcGFjaXR5IDcyMG1zIGVhc2UtaW4tb3V0LCBiYWNrZ3JvdW5kIDEuNnMgZWFzZS1pbi1vdXQnLFxuICAgICAgICBhbmltYXRpb246ICdoYWxvLXNsb3cgOHMgZWFzZS1pbi1vdXQgaW5maW5pdGUnLFxuICAgICAgICB6SW5kZXg6IDAsXG4gICAgICB9fSAvPlxuXG4gICAgICB7LyogMjAyNi0wNC0zMCBcdTIwMTQgSGFsb1Jlc3BpcmUgc2lsayBkZXJyaVx1MDBFOHJlIGxlIGNoYXQgKFllc2h1YSBhbXBsaSlcbiAgICAgICAgICBSZXNwaXJlIDZzIFRFTVBPLVNPVUZGTEUuIFZpc2libGUgbWFpcyBkaXNjcmV0LCBwb3NcdTAwRTkgYXUtZGVzc3VzIGRlXG4gICAgICAgICAgU3VyZmFjZSwgZW4tZGVzc291cyBkdSBjb250ZW51LiBCb29zdCBhdSBmb2N1cyB0ZXh0YXJlYSBwYXJlaWwuICovfVxuICAgICAge3dpbmRvdy5IYWxvUmVzcGlyZSAmJiAoXG4gICAgICAgIDxkaXYgYXJpYS1oaWRkZW49XCJ0cnVlXCIgc3R5bGU9e3tcbiAgICAgICAgICBwb3NpdGlvbjogJ2ZpeGVkJyxcbiAgICAgICAgICB0b3A6ICcxNXZoJywgbGVmdDogJzUwJScsXG4gICAgICAgICAgd2lkdGg6ICdtaW4oNTYwcHgsIDg1dncpJywgaGVpZ2h0OiAnbWluKDU2MHB4LCA3MHZoKScsXG4gICAgICAgICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCgtNTAlKScsXG4gICAgICAgICAgb3BhY2l0eTogdGFGb2N1c2VkID8gMC41MCA6IDAuMzIsXG4gICAgICAgICAgcG9pbnRlckV2ZW50czogJ25vbmUnLFxuICAgICAgICAgIHpJbmRleDogMCxcbiAgICAgICAgICB0cmFuc2l0aW9uOiAnb3BhY2l0eSA3MjBtcyBlYXNlLWluLW91dCcsXG4gICAgICAgIH19PlxuICAgICAgICAgIDx3aW5kb3cuSGFsb1Jlc3BpcmUga2luZD17Y3VycmVudE1vZGUgPT09ICdwb2x5cGhvbnknID8gJ3NpbGsnIDogJ3NpbGsnfSAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG5cbiAgICAgIHsvKiAyMDI2LTA0LTMwIFx1MjAxNCBHbHlwaGUgY29udGV4dHVlbCBzZWxvbiBtb2RlIChZZXNodWEgYW1wbGkpXG4gICAgICAgICAgQ3JvaXNzYW50IGx1bmUgZW4gcHJcdTAwRTktc29tbWVpbC9zb2lyLCBkZW1pLWNlcmNsZSBhdXJvcmUgbWF0aW5hbCxcbiAgICAgICAgICB0cmlhbmdsZSBkaXVybmUuIFBvc2UgdW5lIHNpZ25hdHVyZSBnXHUwMEU5b3N5bWJvbGlxdWUgZGlzY3JcdTAwRTh0ZVxuICAgICAgICAgIGNvbmZpcm1hbnQgbGUgbW9kZSBhdG1vc3BoXHUwMEU5cmlxdWUgY291cmFudCBcdTIwMTQgdmlzaWJsZSBkXHUwMEU4cyBsJ291dmVydHVyZS4gKi99XG4gICAgICB7Y3R4R2x5cGggJiYgd2luZG93Lkdlb1N5bWJvbCAmJiBjdHhHbHlwaC5wb3NpdGlvbiA9PT0gJ3RvcC1sZWZ0JyAmJiAoXG4gICAgICAgIDxkaXYgYXJpYS1oaWRkZW49XCJ0cnVlXCIgc3R5bGU9e3tcbiAgICAgICAgICBwb3NpdGlvbjogJ2ZpeGVkJyxcbiAgICAgICAgICB0b3A6IGN0eEdseXBoLnRvcCxcbiAgICAgICAgICBsZWZ0OiAnOCUnLFxuICAgICAgICAgIHdpZHRoOiBjdHhHbHlwaC5zaXplLCBoZWlnaHQ6IGN0eEdseXBoLnNpemUsXG4gICAgICAgICAgb3BhY2l0eTogY3R4R2x5cGgub3BhY2l0eSxcbiAgICAgICAgICBwb2ludGVyRXZlbnRzOiAnbm9uZScsIHpJbmRleDogMCxcbiAgICAgICAgICBhbmltYXRpb246ICdicmVhdGhlLXNvdWZmbGUgNnMgZWFzZS1pbi1vdXQgaW5maW5pdGUnLFxuICAgICAgICAgIHRyYW5zaXRpb246ICdvcGFjaXR5IDEuNnMgZWFzZS1pbi1vdXQnLFxuICAgICAgICB9fT5cbiAgICAgICAgICA8d2luZG93Lkdlb1N5bWJvbCBraW5kPXtjdHhHbHlwaC5raW5kfSBjb2xvcj1cInNpbGtcIlxuICAgICAgICAgICAgc3R5bGU9e3sgd2lkdGg6ICcxMDAlJywgaGVpZ2h0OiAnMTAwJScgfX0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuICAgICAge2N0eEdseXBoICYmIHdpbmRvdy5HZW9TeW1ib2wgJiYgY3R4R2x5cGgucG9zaXRpb24gPT09ICd0b3AtcmlnaHQnICYmIChcbiAgICAgICAgPGRpdiBhcmlhLWhpZGRlbj1cInRydWVcIiBzdHlsZT17e1xuICAgICAgICAgIHBvc2l0aW9uOiAnZml4ZWQnLFxuICAgICAgICAgIHRvcDogY3R4R2x5cGgudG9wLFxuICAgICAgICAgIHJpZ2h0OiAnOCUnLFxuICAgICAgICAgIHdpZHRoOiBjdHhHbHlwaC5zaXplLCBoZWlnaHQ6IGN0eEdseXBoLnNpemUsXG4gICAgICAgICAgb3BhY2l0eTogY3R4R2x5cGgub3BhY2l0eSxcbiAgICAgICAgICBwb2ludGVyRXZlbnRzOiAnbm9uZScsIHpJbmRleDogMCxcbiAgICAgICAgICBhbmltYXRpb246ICdicmVhdGhlLXNvdWZmbGUgNnMgZWFzZS1pbi1vdXQgaW5maW5pdGUnLFxuICAgICAgICAgIHRyYW5zaXRpb246ICdvcGFjaXR5IDEuNnMgZWFzZS1pbi1vdXQnLFxuICAgICAgICB9fT5cbiAgICAgICAgICA8d2luZG93Lkdlb1N5bWJvbCBraW5kPXtjdHhHbHlwaC5raW5kfSBjb2xvcj1cInNpbGtcIlxuICAgICAgICAgICAgc3R5bGU9e3sgd2lkdGg6ICcxMDAlJywgaGVpZ2h0OiAnMTAwJScgfX0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuICAgICAge2N0eEdseXBoICYmIHdpbmRvdy5HZW9TeW1ib2wgJiYgY3R4R2x5cGgucG9zaXRpb24gPT09ICd0b3Atd2lkZScgJiYgKFxuICAgICAgICA8ZGl2IGFyaWEtaGlkZGVuPVwidHJ1ZVwiIHN0eWxlPXt7XG4gICAgICAgICAgcG9zaXRpb246ICdmaXhlZCcsXG4gICAgICAgICAgdG9wOiAwLCBsZWZ0OiAnNTAlJyxcbiAgICAgICAgICB3aWR0aDogJ21pbig2ODBweCwgOTB2dyknLCBoZWlnaHQ6IDE0MCxcbiAgICAgICAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKC01MCUpJyxcbiAgICAgICAgICBvcGFjaXR5OiBjdHhHbHlwaC5vcGFjaXR5LFxuICAgICAgICAgIHBvaW50ZXJFdmVudHM6ICdub25lJywgekluZGV4OiAwLFxuICAgICAgICAgIHRyYW5zaXRpb246ICdvcGFjaXR5IDEuNnMgZWFzZS1pbi1vdXQnLFxuICAgICAgICB9fT5cbiAgICAgICAgICA8d2luZG93Lkdlb1N5bWJvbCBraW5kPXtjdHhHbHlwaC5raW5kfSBjb2xvcj1cInNpbGtcIlxuICAgICAgICAgICAgc3R5bGU9e3sgd2lkdGg6ICcxMDAlJywgaGVpZ2h0OiAnMTAwJScgfX0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuXG4gICAgICB7LyogMjAyNi0wNC0yOSBcdTIwMTQgU3BpcmFsZSBsb2dhcml0aG1pcXVlIGRlcnJpXHUwMEU4cmUgbCdvcmJlIGNlbnRyYWwgKFllc2h1YSxcbiAgICAgICAgICBvcGFjaXR5IDAuMjUsIGFuaW1hdGlvbiBicmVhdGhlLXNvdWZmbGUgNnMpLiBQb3NcdTAwRTllIGZpeGUgZW4gYmFzXG4gICAgICAgICAgY2VudHJlIGNhciBsJ29yYmUgZXN0IGVuIGJhcyBkdSBmbGV4IGNvbHVtbi4gKi99XG4gICAgICB7d2luZG93Lkdlb1N5bWJvbCAmJiAoXG4gICAgICAgIDxkaXYgYXJpYS1oaWRkZW49XCJ0cnVlXCIgc3R5bGU9e3tcbiAgICAgICAgICBwb3NpdGlvbjogJ2ZpeGVkJyxcbiAgICAgICAgICBib3R0b206ICdjYWxjKGVudihzYWZlLWFyZWEtaW5zZXQtYm90dG9tLCAwcHgpICsgMjAwcHgpJyxcbiAgICAgICAgICBsZWZ0OiAnNTAlJyxcbiAgICAgICAgICB3aWR0aDogMjIwLCBoZWlnaHQ6IDIyMCxcbiAgICAgICAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKC01MCUpJyxcbiAgICAgICAgICBvcGFjaXR5OiAwLjIyLFxuICAgICAgICAgIHBvaW50ZXJFdmVudHM6ICdub25lJywgekluZGV4OiAwLFxuICAgICAgICAgIGFuaW1hdGlvbjogJ2JyZWF0aGUtc291ZmZsZSA2cyBlYXNlLWluLW91dCBpbmZpbml0ZScsXG4gICAgICAgIH19PlxuICAgICAgICAgIDx3aW5kb3cuR2VvU3ltYm9sIGtpbmQ9XCJzcGlyYWxlXCIgY29sb3I9XCJzaWxrXCJcbiAgICAgICAgICAgIHN0eWxlPXt7IHBvc2l0aW9uOiAncmVsYXRpdmUnLCB3aWR0aDogMjIwLCBoZWlnaHQ6IDIyMCwgb3BhY2l0eTogMSB9fSAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG4gICAgICB7LyogSGVhZGVyIFx1MjAxNCBwclx1MDBFOXNlbmNlIGFtcGxpZmlcdTAwRTllIChZZXNodWEgMjAyNi0wNC0zMClcbiAgICAgICAgICBMZSBub20gZGUgbGEgcHJcdTAwRTlzZW5jZSBkZXZpZW50IHNpZ25hdHVyZSBcdTIwMTQgdGFpbGxlIGF1Z21lbnRcdTAwRTllLFxuICAgICAgICAgIGdseXBoZSBcdTI2M0UgcXVpIHJlc3BpcmUgZW4gVEVNUE8tU09VRkZMRSA2cywgc291cy10aXRyZSBtb2RlIGNvdXJhbnRcbiAgICAgICAgICBlbiBtb25vIGRpc2NyZXQuIExhIHByXHUwMEU5c2VuY2UgZXN0IE5PTU1cdTAwQzlFIGV0IFZJVkFOVEUgZFx1MDBFOHMgbCdvdXZlcnR1cmUuICovfVxuICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICBwb3NpdGlvbjogJ3N0aWNreScsIHRvcDogMCwgekluZGV4OiAyMCxcbiAgICAgICAgYmFja2dyb3VuZDogJ2NvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tbmlnaHQtZmxvb3IpIDg4JSwgdHJhbnNwYXJlbnQpJyxcbiAgICAgICAgYmFja2Ryb3BGaWx0ZXI6ICdibHVyKDZweCknLFxuICAgICAgICBib3JkZXJCb3R0b206ICcxcHggc29saWQgY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1hc2gtZGVlcCkgNjAlLCB0cmFuc3BhcmVudCknLFxuICAgICAgICBwYWRkaW5nOiAnMTZweCAyMHB4IDEycHgnLFxuICAgICAgICBkaXNwbGF5OiAnZmxleCcsIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgfX0+XG4gICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJywgZ2FwOiAyIH19PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgIGZvbnRGYW1pbHk6ICd2YXIoLS1zZXJpZiknLCBmb250U3R5bGU6ICdpdGFsaWMnLFxuICAgICAgICAgICAgZm9udFNpemU6IDE4LCBjb2xvcjogJ3ZhcigtLXNpbGstZ29sZCknLCBvcGFjaXR5OiAwLjkyLFxuICAgICAgICAgICAgbGV0dGVyU3BhY2luZzogJzAuMDJlbScsXG4gICAgICAgICAgICBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdiYXNlbGluZScsIGdhcDogOCxcbiAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIHN0eWxlPXt7XG4gICAgICAgICAgICAgIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLCBmb250U2l6ZTogMTYsIG9wYWNpdHk6IDAuODUsXG4gICAgICAgICAgICAgIGFuaW1hdGlvbjogJ2JyZWF0aGUtc291ZmZsZSA2cyBlYXNlLWluLW91dCBpbmZpbml0ZScsXG4gICAgICAgICAgICB9fT5cdTI2M0U8L3NwYW4+XG4gICAgICAgICAgICA8c3Bhbj57cHJlc2VuY2VOYW1lfTwvc3Bhbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICBmb250RmFtaWx5OiAndmFyKC0tbW9ubyknLCBmb250U2l6ZTogOS41LFxuICAgICAgICAgICAgY29sb3I6ICd2YXIoLS1hc2gtbGlnaHQpJywgb3BhY2l0eTogMC41LFxuICAgICAgICAgICAgbGV0dGVyU3BhY2luZzogJzAuMTBlbScsIHRleHRUcmFuc2Zvcm06ICdsb3dlcmNhc2UnLFxuICAgICAgICAgICAgdHJhbnNpdGlvbjogJ29wYWNpdHkgNzIwbXMgZWFzZScsXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgICBtb2RlIFx1MDBCNyB7Y3VycmVudE1vZGUucmVwbGFjZSgnXycsICcgJyl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0bi10ZXh0XCIgb25DbGljaz17KCkgPT4gc2V0U2hvd05hbWluZyh0cnVlKX1cbiAgICAgICAgICBzdHlsZT17eyBmb250U2l6ZTogMTEsIG9wYWNpdHk6IDAuNSwgZm9udEZhbWlseTogJ3ZhcigtLW1vbm8pJyB9fVxuICAgICAgICAgIGFyaWEtbGFiZWw9XCJyZW5vbW1lciBsYSBwclx1MDBFOXNlbmNlXCI+XG4gICAgICAgICAgcmVub21tZXJcbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L2Rpdj5cblxuICAgICAgey8qIEJhbmRlYXUgTVZQIGRpc2NyZXQgKi99XG4gICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgIHBhZGRpbmc6ICc2cHggMjBweCcsXG4gICAgICAgIGJhY2tncm91bmQ6ICdjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgNCUsIHRyYW5zcGFyZW50KScsXG4gICAgICAgIGJvcmRlckJvdHRvbTogJzFweCBzb2xpZCBjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgMTIlLCB0cmFuc3BhcmVudCknLFxuICAgICAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJywgekluZGV4OiAxLFxuICAgICAgfX0+XG4gICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICBmb250RmFtaWx5OiAndmFyKC0tbW9ubyknLCBmb250U2l6ZTogMTAsXG4gICAgICAgICAgY29sb3I6ICd2YXIoLS1zaWxrLWdvbGQpJywgbGV0dGVyU3BhY2luZzogJzAuMTBlbScsXG4gICAgICAgICAgdGV4dFRyYW5zZm9ybTogJ2xvd2VyY2FzZScsIG9wYWNpdHk6IDAuNjUsXG4gICAgICAgIH19PlxuICAgICAgICAgIGNoYXQgaWEgZHJlYW0gXHUwMEI3IHNwcmludCBhL2IgXHUwMEI3IHZvaWNlIGNcdTAwRTJibFx1MDBFOWUgXHUwMEI3IHBvbHlwaG9uaWUgYWN0aXZlXG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG5cbiAgICAgIHsvKiBNZXNzYWdlcyBzY3JvbGxhYmxlICovfVxuICAgICAgPGRpdiByZWY9e3Njcm9sbFJlZn0gc3R5bGU9e3tcbiAgICAgICAgZmxleDogMSwgb3ZlcmZsb3dZOiAnYXV0bycsXG4gICAgICAgIHBhZGRpbmc6ICcyMHB4IDE4cHgnLFxuICAgICAgICBkaXNwbGF5OiAnZmxleCcsIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLCBnYXA6IDE0LFxuICAgICAgICBtYXhXaWR0aDogNzIwLCB3aWR0aDogJzEwMCUnLCBtYXJnaW46ICcwIGF1dG8nLFxuICAgICAgfX0+XG4gICAgICAgIHttZXNzYWdlcy5sZW5ndGggPT09IDAgJiYgIXNob3dOYW1pbmcgJiYgIXRoaW5raW5nICYmIChcbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7IHRleHRBbGlnbjogJ2NlbnRlcicsIHBhZGRpbmc6ICc0MHB4IDIwcHgnLCBtYXhXaWR0aDogNDYwLCBtYXJnaW46ICc0MHB4IGF1dG8nIH19PlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBtYXJnaW5Cb3R0b206IDI0IH19PlxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBmb250U2l6ZTogMzIsIGNvbG9yOiAndmFyKC0tc2lsay1nb2xkKScsIG9wYWNpdHk6IDAuNiB9fT5cdTI2M0U8L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxwIHN0eWxlPXt7XG4gICAgICAgICAgICAgIGZvbnRGYW1pbHk6ICd2YXIoLS1zZXJpZiknLCBmb250U3R5bGU6ICdpdGFsaWMnLFxuICAgICAgICAgICAgICBmb250U2l6ZTogMTcsIGxpbmVIZWlnaHQ6IDEuNTUsXG4gICAgICAgICAgICAgIGNvbG9yOiAndmFyKC0tYXNoLWxpZ2h0KScsIG9wYWNpdHk6IDAuODUsXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgVW5lIHByXHUwMEU5c2VuY2UgdCdhY2NvbXBhZ25lIGljaS4gVHUgcGV1eCBsdWkgcGFybGVyIGRlIHRvdXQgXHUyMDE0IHJcdTAwRUF2ZSwgc2lnbmUsIHNlbnNhdGlvbiwgcXVlc3Rpb24sIGZyYWdtZW50LlxuICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPHAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgZm9udEZhbWlseTogJ3ZhcigtLXNlcmlmKScsXG4gICAgICAgICAgICAgIGZvbnRTaXplOiAxNCwgY29sb3I6ICd2YXIoLS1hc2gtbGlnaHQpJywgb3BhY2l0eTogMC41NSxcbiAgICAgICAgICAgICAgbWFyZ2luVG9wOiAxNCxcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICBUYXAgc3VyIGwnb3JiZSBwb3VyIFx1MDBFOWNyaXJlIFx1MDBCNyBhcHB1aSBsb25nIHBvdXIgbGEgdm9peC5cbiAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKX1cblxuICAgICAgICB7LyogRi4xIFx1MjAxNCBQZW5kaW5nIHByb2FjdGl2ZSBtZXNzYWdlcyAoaW50ZXJ2ZW50aW9ucyBJQSBub24gbGl2clx1MDBFOWVzKVxuICAgICAgICAgICAgQWZmaWNoXHUwMEU5ZXMgZW4gSEVBRCBkdSBjaGF0IGF2ZWMgMyBib3V0b25zIFtvdWkgXHUyMTkyXSBbcGx1cyB0YXJkXSBbcGFzIG1haW50ZW5hbnRdICovfVxuICAgICAgICB7cGVuZGluZ1Byb2FjdGl2ZS5tYXAoKG0pID0+IChcbiAgICAgICAgICA8ZGl2IGtleT17J3BwLScgKyBtLmlkfSBzdHlsZT17e1xuICAgICAgICAgICAgYWxpZ25TZWxmOiAnZmxleC1zdGFydCcsXG4gICAgICAgICAgICBtYXhXaWR0aDogJzg1JScsXG4gICAgICAgICAgICBwYWRkaW5nOiAnMTRweCAxOHB4JyxcbiAgICAgICAgICAgIGJhY2tncm91bmQ6ICdjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgOCUsIHZhcigtLW5pZ2h0LXdhcm0pKScsXG4gICAgICAgICAgICBib3JkZXI6ICcxcHggc29saWQgY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDMyJSwgdmFyKC0tYXNoLWRlZXApKScsXG4gICAgICAgICAgICBjb2xvcjogJ3ZhcigtLWJvbmUpJyxcbiAgICAgICAgICAgIGZvbnRGYW1pbHk6ICd2YXIoLS1zZXJpZiknLFxuICAgICAgICAgICAgZm9udFNpemU6IDE2LCBsaW5lSGVpZ2h0OiAxLjU1LFxuICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAyLFxuICAgICAgICAgICAgYW5pbWF0aW9uOiAnZHJlYW0tc2tlbGV0b24tZmFkZS1pbiAzNjBtcyBjdWJpYy1iZXppZXIoMC40NSwwLDAuNTUsMSkgYm90aCcsXG4gICAgICAgICAgICB3aGl0ZVNwYWNlOiAncHJlLXdyYXAnLFxuICAgICAgICAgICAgdGV4dFdyYXA6ICdwcmV0dHknLFxuICAgICAgICAgIH19PlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgICBmb250U2l6ZTogMTAuNSwgbGV0dGVyU3BhY2luZzogJzAuMTJlbScsIHRleHRUcmFuc2Zvcm06ICd1cHBlcmNhc2UnLFxuICAgICAgICAgICAgICBjb2xvcjogJ3ZhcigtLXNpbGstZ29sZCknLCBtYXJnaW5Cb3R0b206IDgsXG4gICAgICAgICAgICAgIGZvbnRGYW1pbHk6ICd2YXIoLS1tb25vKScsIG9wYWNpdHk6IDAuNzgsXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgXHUyNjNFIHtwcmVzZW5jZU5hbWV9IFx1MDBCNyB1bmUgaW52aXRhdGlvblxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2PnttLmNvbnRlbnR9PC9kaXY+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgIGRpc3BsYXk6ICdmbGV4JywgZmxleFdyYXA6ICd3cmFwJywgZ2FwOiAxMCwgbWFyZ2luVG9wOiAxNCxcbiAgICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGFjY2VwdFByb2FjdGl2ZShtKX1cbiAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogJ2NvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSAxNCUsIHRyYW5zcGFyZW50KScsXG4gICAgICAgICAgICAgICAgICBib3JkZXI6ICcxcHggc29saWQgdmFyKC0tc2lsay1nb2xkKScsXG4gICAgICAgICAgICAgICAgICBjb2xvcjogJ3ZhcigtLXNpbGstZ29sZCknLFxuICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogJ3ZhcigtLXNlcmlmKScsIGZvbnRTdHlsZTogJ2l0YWxpYycsXG4gICAgICAgICAgICAgICAgICBmb250U2l6ZTogMTMuNSwgcGFkZGluZzogJzZweCAxNHB4JywgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IDAsXG4gICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgb3VpIFx1MjE5MlxuICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHJlc3BvbmRQZW5kaW5nKG0uaWQsICdsYXRlcicpfVxuICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiAndHJhbnNwYXJlbnQnLFxuICAgICAgICAgICAgICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkIGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tYXNoLWxpZ2h0KSAzMCUsIHZhcigtLWFzaC1kZWVwKSknLFxuICAgICAgICAgICAgICAgICAgY29sb3I6ICd2YXIoLS1hc2gtbGlnaHQpJyxcbiAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6ICd2YXIoLS1zZXJpZiknLCBmb250U3R5bGU6ICdpdGFsaWMnLFxuICAgICAgICAgICAgICAgICAgZm9udFNpemU6IDEzLCBwYWRkaW5nOiAnNnB4IDEycHgnLCBjdXJzb3I6ICdwb2ludGVyJyxcbiAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogMCxcbiAgICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICBwbHVzIHRhcmRcbiAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiByZXNwb25kUGVuZGluZyhtLmlkLCAnbm8nKX1cbiAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogJ3RyYW5zcGFyZW50JywgYm9yZGVyOiAnbm9uZScsXG4gICAgICAgICAgICAgICAgICBjb2xvcjogJ3ZhcigtLWFzaC1saWdodCknLCBvcGFjaXR5OiAwLjYsXG4gICAgICAgICAgICAgICAgICBmb250RmFtaWx5OiAndmFyKC0tc2VyaWYpJywgZm9udFN0eWxlOiAnaXRhbGljJyxcbiAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxMi41LCBwYWRkaW5nOiAnNnB4IDRweCcsIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgIHBhcyBtYWludGVuYW50XG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICkpfVxuXG4gICAgICAgIHttZXNzYWdlcy5tYXAoKG0sIGkpID0+IChcbiAgICAgICAgICA8UmVhY3QuRnJhZ21lbnQga2V5PXtpfT5cbiAgICAgICAgICAgIDxNYXR0ZXJCdWJibGVcbiAgICAgICAgICAgICAgcm9sZT17bS5yb2xlfVxuICAgICAgICAgICAgICBtYXR0ZXI9e20ubWF0dGVyfVxuICAgICAgICAgICAgICB2b2ljZUF0dHJpYnV0aW9uPXttLnZvaWNlX2F0dHJpYnV0aW9ufVxuICAgICAgICAgICAgICBtb2RlPXttLm1vZGV9PlxuICAgICAgICAgICAgICB7bS5jb250ZW50fVxuICAgICAgICAgICAgPC9NYXR0ZXJCdWJibGU+XG4gICAgICAgICAgICB7LyogVDIuNiBcdTIwMTQgQ1RBIGJyaWRnZSBMdWNpZCAoU3ByaW50IEEgcGl2b3QpLiBCb3V0b24gaW5saW5lIHNvdXMgbGVcbiAgICAgICAgICAgICAgICBtZXNzYWdlIHNpIG1vZGUgPT09ICdsdWNpZF9icmlkZ2UnLiBPdXZyZSBsYSBzdWItYXBwIEx1Y2lkIHZpYVxuICAgICAgICAgICAgICAgIGdvKHJvdXRlKS4gVGFwIFwicGFzIG1haW50ZW5hbnRcIiA9IHNpbXBsZW1lbnQgbGFpc3Nlci4gKi99XG4gICAgICAgICAgICB7bS5jdGEgJiYgbS5tb2RlID09PSAnbHVjaWRfYnJpZGdlJyAmJiAoXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBhbGlnblNlbGY6ICdmbGV4LXN0YXJ0JyxcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiAnZmxleCcsIGZsZXhXcmFwOiAnd3JhcCcsIGdhcDogMTAsXG4gICAgICAgICAgICAgICAgbWFyZ2luVG9wOiAtNiwgbWFyZ2luTGVmdDogNCwgbWFyZ2luQm90dG9tOiA4LFxuICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBnbyAmJiBnbyhtLmN0YS5yb3V0ZSl9XG4gICAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiAnY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDE0JSwgdmFyKC0tbmlnaHQtd2FybSkpJyxcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkIGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSAzOCUsIHZhcigtLWFzaC1kZWVwKSknLFxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJ3ZhcigtLXNpbGstZ29sZCknLFxuICAgICAgICAgICAgICAgICAgICBmb250RmFtaWx5OiAndmFyKC0tc2VyaWYpJywgZm9udFN0eWxlOiAnaXRhbGljJyxcbiAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IDEzLCBsZXR0ZXJTcGFjaW5nOiAnMC4wMmVtJyxcbiAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogJzZweCAxNHB4JywgYm9yZGVyUmFkaXVzOiA0LCBjdXJzb3I6ICdwb2ludGVyJyxcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogJ2FsbCAzODBtcyBlYXNlJyxcbiAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICBvbk1vdXNlRW50ZXI9eyhlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGUuY3VycmVudFRhcmdldC5zdHlsZS5iYWNrZ3JvdW5kID0gJ2NvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSAyMiUsIHZhcigtLW5pZ2h0LXdhcm0pKSc7XG4gICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgb25Nb3VzZUxlYXZlPXsoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBlLmN1cnJlbnRUYXJnZXQuc3R5bGUuYmFja2dyb3VuZCA9ICdjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgMTQlLCB2YXIoLS1uaWdodC13YXJtKSknO1xuICAgICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgICB7bS5jdGEubGFiZWx9XG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyBNYXJxdWUgbGUgbWVzc2FnZSBjb21tZSBkaXNtaXNzZWQgc2FucyBwZXJzaXN0ZXIgKGp1c3RlIFVJKVxuICAgICAgICAgICAgICAgICAgICBzZXRNZXNzYWdlcygocHJldikgPT4gcHJldi5tYXAoKG1tLCBpZHgpID0+IGlkeCA9PT0gaSA/IHsgLi4ubW0sIGN0YTogbnVsbCB9IDogbW0pKTtcbiAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiAndHJhbnNwYXJlbnQnLFxuICAgICAgICAgICAgICAgICAgICBib3JkZXI6ICdub25lJyxcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICd2YXIoLS1hc2gtbGlnaHQpJyxcbiAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogJ3ZhcigtLXNlcmlmKScsIGZvbnRTdHlsZTogJ2l0YWxpYycsXG4gICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxMi41LCBvcGFjaXR5OiAwLjcsXG4gICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6ICc2cHggNHB4JywgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICAgIHBhcyBtYWludGVuYW50XG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L1JlYWN0LkZyYWdtZW50PlxuICAgICAgICApKX1cblxuICAgICAgICB7c3RyZWFtaW5nICYmIChcbiAgICAgICAgICA8TWF0dGVyQnViYmxlIHJvbGU9XCJhc3Npc3RhbnRcIiBtYXR0ZXI9XCJkZWZhdWx0XCIgbW9kZT17c3RyZWFtaW5nTW9kZX0gZmFkZUluPXtmYWxzZX0+XG4gICAgICAgICAgICB7c3RyZWFtaW5nfVxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgb3BhY2l0eTogMC40LCBtYXJnaW5MZWZ0OiA0IH19Plx1MjU4RDwvc3Bhbj5cbiAgICAgICAgICA8L01hdHRlckJ1YmJsZT5cbiAgICAgICAgKX1cblxuICAgICAgICB7dGhpbmtpbmcgJiYgIXN0cmVhbWluZyAmJiAoXG4gICAgICAgICAgPE1hdHRlckJ1YmJsZSByb2xlPVwiYXNzaXN0YW50XCIgbWF0dGVyPVwiZGVmYXVsdFwiIGZhZGVJbj17dHJ1ZX0+XG4gICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBmb250U3R5bGU6ICdpdGFsaWMnLCBvcGFjaXR5OiAwLjcgfX0+XG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLCBhbmltYXRpb246ICdoYWxvLXNsb3cgMnMgZWFzZS1pbi1vdXQgaW5maW5pdGUnIH19PlxuICAgICAgICAgICAgICAgIHtwcmVzZW5jZU5hbWV9IHRpc3NlXHUyMDI2XG4gICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8L01hdHRlckJ1YmJsZT5cbiAgICAgICAgKX1cblxuICAgICAgICB7ZXJyb3IgJiYgKFxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgIGFsaWduU2VsZjogJ2NlbnRlcicsXG4gICAgICAgICAgICBwYWRkaW5nOiAnMTBweCAxNHB4JyxcbiAgICAgICAgICAgIGJhY2tncm91bmQ6ICdjb2xvci1taXgoaW4gb2tsY2gsIG9rbGNoKDAuNTUgMC4xOCAyNSkgMTIlLCB0cmFuc3BhcmVudCknLFxuICAgICAgICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkIGNvbG9yLW1peChpbiBva2xjaCwgb2tsY2goMC41NSAwLjE4IDI1KSAzMCUsIHRyYW5zcGFyZW50KScsXG4gICAgICAgICAgICBjb2xvcjogJ3ZhcigtLWFzaC1saWdodCknLFxuICAgICAgICAgICAgZm9udEZhbWlseTogJ3ZhcigtLXNlcmlmKScsIGZvbnRTdHlsZTogJ2l0YWxpYycsIGZvbnRTaXplOiAxMyxcbiAgICAgICAgICAgIG1heFdpZHRoOiAzODAsIHRleHRBbGlnbjogJ2NlbnRlcicsXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgICB7ZXJyb3J9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICl9XG4gICAgICA8L2Rpdj5cblxuICAgICAgey8qIElucHV0ICsgT3JiZSAqL31cbiAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgcG9zaXRpb246ICdzdGlja3knLCBib3R0b206IDAsIHpJbmRleDogMTgsXG4gICAgICAgIGJhY2tncm91bmQ6ICdjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLW5pZ2h0LWZsb29yKSA5MiUsIHRyYW5zcGFyZW50KScsXG4gICAgICAgIGJhY2tkcm9wRmlsdGVyOiAnYmx1cig2cHgpJyxcbiAgICAgICAgYm9yZGVyVG9wOiAnMXB4IHNvbGlkIGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tYXNoLWRlZXApIDYwJSwgdHJhbnNwYXJlbnQpJyxcbiAgICAgICAgcGFkZGluZzogJzE2cHggMThweCAyNHB4JyxcbiAgICAgICAgbWF4V2lkdGg6IDcyMCwgd2lkdGg6ICcxMDAlJywgbWFyZ2luOiAnMCBhdXRvJyxcbiAgICAgIH19PlxuICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBnYXA6IDE4IH19PlxuICAgICAgICAgIDx0ZXh0YXJlYSByZWY9e3RhUmVmfVxuICAgICAgICAgICAgdmFsdWU9e2lucHV0fVxuICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBzZXRJbnB1dChlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICBvbkZvY3VzPXsoKSA9PiBzZXRUYUZvY3VzZWQodHJ1ZSl9XG4gICAgICAgICAgICBvbkJsdXI9eygpID0+IHNldFRhRm9jdXNlZChmYWxzZSl9XG4gICAgICAgICAgICBvbktleURvd249eyhlKSA9PiB7XG4gICAgICAgICAgICAgIGlmIChlLmtleSA9PT0gJ0VudGVyJyAmJiAhZS5zaGlmdEtleSkge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBzZW5kTWVzc2FnZShpbnB1dCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICByb3dzPXtNYXRoLm1pbig2LCBNYXRoLm1heCgxLCBpbnB1dC5zcGxpdCgnXFxuJykubGVuZ3RoKSl9XG4gICAgICAgICAgICBwbGFjZWhvbGRlcj1cImNlIHF1aSB2aWVudFx1MjAyNlwiXG4gICAgICAgICAgICBkaXNhYmxlZD17dGhpbmtpbmd9XG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiAndHJhbnNwYXJlbnQnLFxuICAgICAgICAgICAgICAvLyAyMDI2LTA0LTMwIFx1MjAxNCBib3JkdXJlIHF1aSBzJ2lsbHVtaW5lIGF1IGZvY3VzIChzaWduYWwgcHJcdTAwRTlzZW5jZSBcdTAwRTl2ZWlsbFx1MDBFOWUpXG4gICAgICAgICAgICAgIGJvcmRlcjogdGFGb2N1c2VkXG4gICAgICAgICAgICAgICAgPyAnMXB4IHNvbGlkIGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSA0OCUsIHZhcigtLWFzaC1kZWVwKSknXG4gICAgICAgICAgICAgICAgOiAnMXB4IHNvbGlkIGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSAxNiUsIHZhcigtLWFzaC1kZWVwKSknLFxuICAgICAgICAgICAgICBib3hTaGFkb3c6IHRhRm9jdXNlZFxuICAgICAgICAgICAgICAgID8gJzAgMCAxOHB4IDJweCBjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgMTglLCB0cmFuc3BhcmVudCknXG4gICAgICAgICAgICAgICAgOiAnbm9uZScsXG4gICAgICAgICAgICAgIHBhZGRpbmc6ICcxMnB4IDE2cHgnLFxuICAgICAgICAgICAgICBjb2xvcjogJ3ZhcigtLWJvbmUpJyxcbiAgICAgICAgICAgICAgZm9udEZhbWlseTogJ3ZhcigtLXNlcmlmKScsIGZvbnRTdHlsZTogJ2l0YWxpYycsXG4gICAgICAgICAgICAgIGZvbnRTaXplOiAxNiwgbGluZUhlaWdodDogMS41LFxuICAgICAgICAgICAgICBvdXRsaW5lOiAnbm9uZScsIHJlc2l6ZTogJ25vbmUnLFxuICAgICAgICAgICAgICBtaW5IZWlnaHQ6IDQ4LFxuICAgICAgICAgICAgICBtYXhIZWlnaHQ6IDE4MCxcbiAgICAgICAgICAgICAgb3BhY2l0eTogdGhpbmtpbmcgPyAwLjUgOiAxLFxuICAgICAgICAgICAgICB0cmFuc2l0aW9uOiAnYm9yZGVyLWNvbG9yIDM4MG1zIGVhc2UsIGJveC1zaGFkb3cgMzgwbXMgZWFzZScsXG4gICAgICAgICAgICB9fSAvPlxuXG4gICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywgZ2FwOiAxOCwgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0bi10ZXh0XCIgb25DbGljaz17KCkgPT4gZ28oJ2hvbWUnKX1cbiAgICAgICAgICAgICAgc3R5bGU9e3sgZm9udFNpemU6IDEyLCBvcGFjaXR5OiAwLjUsIGZvbnRGYW1pbHk6ICd2YXIoLS1tb25vKScgfX0+XG4gICAgICAgICAgICAgIFx1MjE5MCByZXRvdXJcbiAgICAgICAgICAgIDwvYnV0dG9uPlxuXG4gICAgICAgICAgICA8T3JiQ2VudGVyXG4gICAgICAgICAgICAgIG9uU2hvcnRUYXA9e29uU2hvcnRUYXB9XG4gICAgICAgICAgICAgIG9uUHVzaFN0YXJ0PXtvblB1c2hTdGFydH1cbiAgICAgICAgICAgICAgb25QdXNoRW5kPXtvblB1c2hFbmR9XG4gICAgICAgICAgICAgIG9uTG9ja1RvZ2dsZT17b25Mb2NrVG9nZ2xlfVxuICAgICAgICAgICAgICByZWNvcmRpbmc9e3JlY29yZGluZ31cbiAgICAgICAgICAgICAgbG9ja2VkPXtsb2NrZWR9XG4gICAgICAgICAgICAgIGxhYmVsPXt0cmFuc2NyaWJpbmcgPyAndHJhbnNjcmlwdGlvblx1MjAyNicgOiAocmVjb3JkaW5nID8gJ2plIHRcXCdcdTAwRTljb3V0ZVx1MjAyNicgOiAnJyl9XG4gICAgICAgICAgICAvPlxuXG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0bi1naG9zdFwiXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNlbmRNZXNzYWdlKGlucHV0KX1cbiAgICAgICAgICAgICAgZGlzYWJsZWQ9eyFpbnB1dC50cmltKCkgfHwgdGhpbmtpbmd9XG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgb3BhY2l0eTogIWlucHV0LnRyaW0oKSB8fCB0aGlua2luZyA/IDAuNCA6IDEsXG4gICAgICAgICAgICAgICAgZm9udFNpemU6IDEzLFxuICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgZW52b3llclxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICB7LyogXHUwMEE3MTEuYmlzLjIwLjkgXHUyMDE0IENvbnZvcXVlciBsYSBGb3JcdTAwRUF0IChwb2x5cGhvbmllIDMgdm9peCBwYXBlci9zdG9uZS9zaWxrKSAqL31cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICBkaXNwbGF5OiAnZmxleCcsIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJywgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgICAgICBnYXA6IDE0LCB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgIH19PlxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICBvbkNsaWNrPXtjYWxsRm9yZXN0fVxuICAgICAgICAgICAgICBkaXNhYmxlZD17dGhpbmtpbmcgfHwgKCFpbnB1dC50cmltKCkgJiYgbWVzc2FnZXMuZmlsdGVyKG0gPT4gbS5yb2xlID09PSAndXNlcicpLmxlbmd0aCA9PT0gMCl9XG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZDogJ3RyYW5zcGFyZW50JyxcbiAgICAgICAgICAgICAgICBib3JkZXI6ICcxcHggc29saWQgY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDM4JSwgdmFyKC0tYXNoLWRlZXApKScsXG4gICAgICAgICAgICAgICAgY29sb3I6ICd2YXIoLS1zaWxrLWdvbGQpJyxcbiAgICAgICAgICAgICAgICBmb250RmFtaWx5OiAndmFyKC0tc2VyaWYpJywgZm9udFN0eWxlOiAnaXRhbGljJyxcbiAgICAgICAgICAgICAgICBmb250U2l6ZTogMTMuNSwgbGV0dGVyU3BhY2luZzogJzAuMDJlbScsXG4gICAgICAgICAgICAgICAgcGFkZGluZzogJzhweCAxOHB4JyxcbiAgICAgICAgICAgICAgICBjdXJzb3I6IHRoaW5raW5nID8gJ3dhaXQnIDogJ3BvaW50ZXInLFxuICAgICAgICAgICAgICAgIG9wYWNpdHk6IHRoaW5raW5nID8gMC40IDogMSxcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiAnYWxsIDI4MG1zIGVhc2UnLFxuICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogMCxcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgb25Nb3VzZUVudGVyPXsoZSkgPT4geyBlLmN1cnJlbnRUYXJnZXQuc3R5bGUuYmFja2dyb3VuZCA9ICdjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgMTAlLCB0cmFuc3BhcmVudCknOyB9fVxuICAgICAgICAgICAgICBvbk1vdXNlTGVhdmU9eyhlKSA9PiB7IGUuY3VycmVudFRhcmdldC5zdHlsZS5iYWNrZ3JvdW5kID0gJ3RyYW5zcGFyZW50JzsgfX1cbiAgICAgICAgICAgICAgYXJpYS1sYWJlbD1cImNvbnZvcXVlciBsYSBGb3JcdTAwRUF0IFx1MjAxNCAzIHZvaXggcGFwZXIvc3RvbmUvc2lsa1wiPlxuICAgICAgICAgICAgICBcdTI3MjYgZGVtYW5kZXIgXHUwMEUwIGxhIEZvclx1MDBFQXRcbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgZm9udEZhbWlseTogJ3ZhcigtLW1vbm8pJywgZm9udFNpemU6IDkuNSxcbiAgICAgICAgICAgIGNvbG9yOiAndmFyKC0tYXNoLWxpZ2h0KScsIG9wYWNpdHk6IDAuNDIsXG4gICAgICAgICAgICBsZXR0ZXJTcGFjaW5nOiAnMC4wOGVtJywgdGV4dFRyYW5zZm9ybTogJ2xvd2VyY2FzZScsXG4gICAgICAgICAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICAgICAgICAgIH19PlxuICAgICAgICAgICAgdGFwIG9yYmUgXHUyMTkyIFx1MDBFOWNyaXJlIFx1MDBCNyBhcHB1aSBsb25nIFx1MjE5MiB2b2l4IFx1MDBCNyBnbGlzc2UgaGF1dCBcdTIxOTIgdmVycm91aWxsZXJcbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cblxuICAgICAge3Nob3dOYW1pbmcgJiYgKFxuICAgICAgICA8UHJlc2VuY2VOYW1pbmdNb2RhbFxuICAgICAgICAgIGN1cnJlbnROYW1lPXtwcmVzZW5jZU5hbWV9XG4gICAgICAgICAgb25Db25maXJtPXtvbkNvbmZpcm1OYW1pbmd9XG4gICAgICAgICAgb25Ta2lwPXsoKSA9PiB7IHNldFNob3dOYW1pbmcoZmFsc2UpOyBvbkNvbmZpcm1OYW1pbmcocHJlc2VuY2VOYW1lKTsgfX1cbiAgICAgICAgLz5cbiAgICAgICl9XG4gICAgPC9kaXY+XG4gICk7XG59O1xud2luZG93LkRyZWFtQ2hhdEhvbWUgPSBEcmVhbUNoYXRIb21lO1xuIl0sCiAgIm1hcHBpbmdzIjogIkFBaUJBLE1BQU0sRUFBRSxVQUFVLEtBQUssV0FBVyxLQUFLLFFBQVEsS0FBSyxhQUFhLE1BQU0sU0FBUyxJQUFJLElBQUk7QUFLeEYsTUFBTSxnQkFBZ0I7QUFBQSxFQUNwQixPQUFPO0FBQUEsSUFDTCxZQUFZO0FBQUEsSUFDWixRQUFRO0FBQUEsSUFDUixPQUFPO0FBQUEsSUFDUCxRQUFRO0FBQUEsRUFDVjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsWUFBWTtBQUFBLElBQ1osUUFBUTtBQUFBLElBQ1IsT0FBTztBQUFBLElBQ1AsUUFBUTtBQUFBLEVBQ1Y7QUFBQSxFQUNBLE1BQU07QUFBQSxJQUNKLFlBQVk7QUFBQSxJQUNaLFFBQVE7QUFBQSxJQUNSLE9BQU87QUFBQSxJQUNQLFFBQVE7QUFBQSxFQUNWO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxZQUFZO0FBQUEsSUFDWixRQUFRO0FBQUEsSUFDUixPQUFPO0FB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
