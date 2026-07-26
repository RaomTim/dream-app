/**
 * screens-dream-chat-home.jsx — Chat IA Dream personnel (pivot 2026-04-28)
 *
 * Spec : 2_DESIGN.md §11.bis.20 + 3_TECHNICAL.md §39
 *
 * Composants exposés :
 *   window.MatterBubble       — bulle paper/stone/silk/default avec voice attribution optionnelle
 *   window.OrbCenter          — orbe pulsante chaude (push-to-record + lock par glisse haut)
 *   window.PresenceNamingModal — onboarding nommage Anima default
 *   window.DreamChatHome      — composant principal chat home
 *
 * Routes app.jsx :
 *   case "dream-chat" → <window.DreamChatHome go={go} />
 *
 * NOTE Sprint A : voice input STUB pour l'instant (UI seulement, Whisper câblage Sprint B).
 */

const { useState: dcS, useEffect: dcE, useRef: dcR, useCallback: dcCB, useMemo: dcM } = React;

// ════════════════════════════════════════════════════════════════════
// MATTER BUBBLE — paper / stone / silk / default present
// ════════════════════════════════════════════════════════════════════
const MATTER_STYLES = {
  paper: {
    background: 'color-mix(in oklch, var(--day-paper) 18%, var(--night-warm))',
    border: '1px solid color-mix(in oklch, var(--silk-gold) 22%, var(--ash-deep))',
    color: 'var(--bone)',
    accent: 'color-mix(in oklch, var(--silk-gold) 60%, var(--day-paper))',
  },
  stone: {
    background: 'color-mix(in oklch, var(--ash-mid) 28%, var(--night-warm))',
    border: '1px solid color-mix(in oklch, var(--ash-light) 30%, var(--ash-deep))',
    color: 'var(--bone)',
    accent: 'color-mix(in oklch, var(--ash-light) 70%, var(--bone))',
  },
  silk: {
    background: 'color-mix(in oklch, var(--silk-gold) 10%, var(--night-warm))',
    border: '1px solid color-mix(in oklch, var(--silk-gold) 38%, var(--ash-deep))',
    color: 'var(--bone)',
    accent: 'var(--silk-gold)',
  },
  default: {
    background: 'color-mix(in oklch, var(--night-warm) 80%, transparent)',
    border: '1px solid color-mix(in oklch, var(--silk-gold) 14%, var(--ash-deep))',
    color: 'var(--bone)',
    accent: 'var(--ash-light)',
  },
  user: {
    background: 'color-mix(in oklch, var(--silk-gold) 14%, var(--night-warm))',
    border: '1px solid color-mix(in oklch, var(--silk-gold) 24%, transparent)',
    color: 'var(--bone)',
    accent: 'var(--silk-gold)',
  },
};

const MatterBubble = ({ role = 'assistant', matter = 'default', voiceAttribution, mode, children, fadeIn = true }) => {
  const styleKey = role === 'user' ? 'user' : (matter || 'default');
  const s = MATTER_STYLES[styleKey] || MATTER_STYLES.default;
  return (
    <div style={{
      alignSelf: role === 'user' ? 'flex-end' : 'flex-start',
      maxWidth: '85%',
      padding: '14px 18px',
      background: s.background,
      border: s.border,
      color: s.color,
      fontFamily: 'var(--serif)',
      fontSize: 16,
      lineHeight: 1.55,
      borderRadius: 2,
      animation: fadeIn ? 'dream-skeleton-fade-in 360ms cubic-bezier(0.45,0,0.55,1) both' : undefined,
      whiteSpace: 'pre-wrap',
      textWrap: 'pretty',
    }}>
      {voiceAttribution && role !== 'user' && (
        <div style={{
          fontSize: 10.5, letterSpacing: '0.12em', textTransform: 'uppercase',
          color: s.accent, marginBottom: 8, fontFamily: 'var(--mono)', opacity: 0.75,
        }}>
          {matter ? matter + ' · ' : ''}{voiceAttribution}
        </div>
      )}
      {children}
      {mode && mode !== 'neutral' && role !== 'user' && (
        <div style={{
          marginTop: 8, fontSize: 9.5, letterSpacing: '0.08em',
          color: 'var(--ash-light)', opacity: 0.42, fontFamily: 'var(--mono)',
          textTransform: 'lowercase',
        }}>
          mode · {mode.replace('_', ' ')}
        </div>
      )}
    </div>
  );
};
window.MatterBubble = MatterBubble;

// ════════════════════════════════════════════════════════════════════
// ORB CENTER — orbe pulsante chaude (§11.bis.20.15)
// Push-to-record + lock par glisse vers le haut
// ════════════════════════════════════════════════════════════════════
const ORB_KEYFRAMES_KEY = 'dream-orb-keyframes-v1';
function ensureOrbKeyframes() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(ORB_KEYFRAMES_KEY)) return;
  const style = document.createElement('style');
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

const OrbCenter = ({ onShortTap, onPushStart, onPushEnd, onLockToggle, recording = false, locked = false, label = '' }) => {
  dcE(() => { ensureOrbKeyframes(); }, []);
  const orbRef = dcR(null);
  const pressTimerRef = dcR(null);
  const startYRef = dcR(0);
  const longPressActiveRef = dcR(false);
  const [pressing, setPressing] = dcS(false);
  const [hint, setHint] = dcS('');

  const cancelPressTimer = () => {
    if (pressTimerRef.current) { clearTimeout(pressTimerRef.current); pressTimerRef.current = null; }
  };

  const handleDown = (clientY) => {
    setPressing(true);
    startYRef.current = clientY;
    longPressActiveRef.current = false;
    pressTimerRef.current = setTimeout(() => {
      longPressActiveRef.current = true;
      setHint('relâche pour envoyer · glisse vers le haut pour verrouiller');
      if (onPushStart) onPushStart();
    }, 350);
  };

  const handleUp = () => {
    setPressing(false);
    cancelPressTimer();
    if (locked) {
      // si locked, un tap supplémentaire stoppe
      if (onLockToggle) onLockToggle(false);
      setHint('');
      return;
    }
    if (longPressActiveRef.current) {
      if (onPushEnd) onPushEnd();
      setHint('');
    } else {
      if (onShortTap) onShortTap();
    }
    longPressActiveRef.current = false;
  };

  const handleMove = (clientY) => {
    if (!longPressActiveRef.current || locked) return;
    const dy = startYRef.current - clientY;
    if (dy > 60) {
      // glisse vers le haut → lock
      longPressActiveRef.current = false;
      if (onLockToggle) onLockToggle(true);
      setHint('verrouillé · tape pour stopper');
    }
  };

  const animationName = locked
    ? 'dream-orb-locked-pulse'
    : (recording || pressing ? 'dream-orb-breathe-strong' : 'dream-orb-breathe');
  const animationDuration = locked ? '1.4s' : (recording || pressing ? '1.2s' : '3s');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, position: 'relative' }}>
      {/* 2026-04-29 (Yeshua, FIX P0 anim) — HaloRespire silk autour de l'orbe.
          Posé derrière, légèrement plus large, opacity 0.55 — le souffle de
          la respiration accompagne le pulsation chaude de l'orbe. */}
      {window.HaloRespire && (
        <div aria-hidden="true" style={{
          position: 'absolute', top: -60, left: '50%',
          transform: 'translateX(-50%)',
          width: 200, height: 200,
          pointerEvents: 'none', opacity: 0.55, zIndex: 0,
        }}>
          <window.HaloRespire kind="silk" />
        </div>
      )}
      <button
        ref={orbRef}
        aria-label="orbe — tap court pour chat / appui long pour enregistrer / glisse haut pour verrouiller"
        onMouseDown={(e) => handleDown(e.clientY)}
        onMouseUp={handleUp}
        onMouseLeave={() => { setPressing(false); cancelPressTimer(); }}
        onMouseMove={(e) => pressing && handleMove(e.clientY)}
        onTouchStart={(e) => handleDown(e.touches[0]?.clientY ?? 0)}
        onTouchEnd={handleUp}
        onTouchMove={(e) => handleMove(e.touches[0]?.clientY ?? 0)}
        style={{
          width: 80, height: 80,
          borderRadius: '50%',
          background: 'radial-gradient(circle, oklch(0.78 0.18 70) 0%, oklch(0.56 0.13 50) 70%, oklch(0.40 0.10 40) 100%)',
          boxShadow: locked
            ? '0 0 32px 12px oklch(0.85 0.20 50 / 0.55)'
            : '0 0 24px 8px oklch(0.65 0.15 60 / 0.4)',
          border: 'none',
          cursor: 'pointer',
          animation: `${animationName} ${animationDuration} ease-in-out infinite`,
          position: 'relative',
          WebkitTapHighlightColor: 'transparent',
          touchAction: 'none',
          userSelect: 'none',
        }}>
        <span aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, opacity: 0.32, color: 'var(--bone)',
          fontFamily: 'var(--serif)', fontStyle: 'italic',
        }}>
          {locked ? '■' : (recording || pressing ? '●' : '✦')}
        </span>
      </button>
      {(label || hint) && (
        <div style={{
          fontFamily: 'var(--serif)', fontStyle: 'italic',
          fontSize: 12.5, color: 'var(--ash-light)', opacity: 0.72,
          textAlign: 'center', maxWidth: 280, lineHeight: 1.4,
        }}>
          {hint || label}
        </div>
      )}
    </div>
  );
};
window.OrbCenter = OrbCenter;

// ════════════════════════════════════════════════════════════════════
// PRESENCE NAMING MODAL — onboarding (Anima default)
// ════════════════════════════════════════════════════════════════════
const PRESENCE_SUGGESTIONS = ['Anima', 'Lune', 'Tisseuse', 'Présence', 'Veilleuse'];

const PresenceNamingModal = ({ onConfirm, onSkip, currentName = '' }) => {
  const [name, setName] = dcS(currentName || 'Anima');
  const [showCustom, setShowCustom] = dcS(false);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 500,
      background: 'color-mix(in oklch, var(--night-floor) 92%, transparent)',
      backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        maxWidth: 460, width: '100%',
        background: 'color-mix(in oklch, var(--night-warm) 95%, transparent)',
        border: '1px solid color-mix(in oklch, var(--silk-gold) 22%, var(--ash-deep))',
        padding: 32,
        animation: 'dream-skeleton-fade-in 480ms cubic-bezier(0.45,0,0.55,1)',
      }}>
        <div style={{
          fontFamily: 'var(--serif)', fontStyle: 'italic',
          fontSize: 13, color: 'var(--silk-gold)', letterSpacing: '0.08em',
          marginBottom: 18, textTransform: 'lowercase', opacity: 0.85,
        }}>
          ☾ une présence pour t'accompagner
        </div>
        <h2 style={{
          fontFamily: 'var(--serif)', fontStyle: 'italic',
          fontSize: 22, color: 'var(--bone)', lineHeight: 1.4,
          margin: '0 0 14px',
        }}>
          Avant tout — comment veux-tu nommer la présence qui va t'accompagner ici ?
        </h2>
        <p style={{
          fontFamily: 'var(--serif)',
          fontSize: 14, color: 'var(--ash-light)',
          margin: '0 0 24px', lineHeight: 1.5, opacity: 0.78,
        }}>
          Elle écoutera tes rêves, tes signes, tes fragments. Elle ne dira jamais le sens — elle proposera des angles. Tu peux la renommer plus tard.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 18 }}>
          {PRESENCE_SUGGESTIONS.map((s) => (
            <button key={s} className="chip"
              onClick={() => { setName(s); setShowCustom(false); }}
              style={name === s ? {
                borderColor: 'var(--silk-gold)',
                color: 'var(--silk-gold)',
                background: 'color-mix(in oklch, var(--silk-gold) 12%, transparent)',
              } : undefined}>
              {s}
            </button>
          ))}
          <button className="chip" onClick={() => setShowCustom(true)}
            style={showCustom ? {
              borderColor: 'var(--silk-gold)',
              color: 'var(--silk-gold)',
              background: 'color-mix(in oklch, var(--silk-gold) 12%, transparent)',
            } : undefined}>
            ✎ personnalisé
          </button>
        </div>

        {showCustom && (
          <input
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 40))}
            autoFocus
            placeholder="prénom ou mot que tu choisis…"
            style={{
              width: '100%',
              background: 'transparent',
              border: '1px solid var(--ash-deep)',
              padding: '12px 14px',
              color: 'var(--bone)',
              fontFamily: 'var(--serif)', fontStyle: 'italic',
              fontSize: 16, marginBottom: 18, outline: 'none',
            }} />
        )}

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', alignItems: 'center', marginTop: 8 }}>
          {onSkip && (
            <button className="btn-text" onClick={onSkip}
              style={{ fontSize: 13, opacity: 0.7 }}>
              passer →
            </button>
          )}
          <button className="btn-ghost"
            disabled={!name.trim()}
            onClick={() => onConfirm(name.trim() || 'Anima')}
            style={{ opacity: !name.trim() ? 0.4 : 1 }}>
            confirmer
          </button>
        </div>
      </div>
    </div>
  );
};
window.PresenceNamingModal = PresenceNamingModal;

// ════════════════════════════════════════════════════════════════════
// DREAM CHAT HOME — composant principal
// ════════════════════════════════════════════════════════════════════
const DreamChatHome = ({ go }) => {
  const [session, setSession] = dcS(null);          // { id, presence_name, rythme, ... }
  const [messages, setMessages] = dcS([]);          // [{ role, content, matter, voice_attribution, mode, created_at }]
  const [pendingProactive, setPendingProactive] = dcS([]); // F.1 — interventions IA non livrées
  const [streaming, setStreaming] = dcS('');        // texte en cours de streaming
  const [streamingMode, setStreamingMode] = dcS(null);
  const [thinking, setThinking] = dcS(false);
  // 2026-04-28 — Bridge depuis sub-apps (Lucid, Cercle…) via sessionStorage
  // Format : sessionStorage.setItem("dream:chat:prefilled", "Texte pré-rempli")
  // Consommé une seule fois au mount, puis effacé.
  const [input, setInput] = dcS(() => {
    try {
      const prefilled = sessionStorage.getItem('dream:chat:prefilled');
      if (prefilled) {
        sessionStorage.removeItem('dream:chat:prefilled');
        return prefilled;
      }
    } catch {}
    return '';
  });
  const [recording, setRecording] = dcS(false);
  const [locked, setLocked] = dcS(false);
  const [showNaming, setShowNaming] = dcS(false);
  const [error, setError] = dcS('');
  const [taFocused, setTaFocused] = dcS(false); // 2026-04-30 — focus textarea = halo s'intensifie
  const scrollRef = dcR(null);
  const taRef = dcR(null);

  // 1️⃣ Mount — charge session + history + pending proactive (en parallèle)
  dcE(() => {
    let cancelled = false;
    (async () => {
      try {
        const token = await window.DreamAuth?.getAccessToken?.();
        if (!token && !window.DreamAuth?.noAuth) {
          setError('Authentication requise');
          return;
        }
        const headers = token ? { Authorization: 'Bearer ' + token } : {};

        // F.1 + F.4 — Fetch session/messages ET pending proactive ET discoverability check en parallèle
        // Le discoverability/check crée éventuellement une nouvelle pending_proactive_message
        // (paliers 3/7/14/30) AVANT qu'on ne fetche le pending — donc on chain : check d'abord,
        // puis pending. Mais en pratique, attendre check ralentit le mount → on fait les deux
        // en parallèle, et si check ajoute quelque chose, le prochain mount le verra.
        const [sessRes, pendRes] = await Promise.allSettled([
          fetch('/api/dream-chat/converse', { method: 'GET', headers }),
          fetch('/api/dream-chat/proactive/pending', { method: 'GET', headers }),
        ]);

        // Fire-and-forget : déclenche discoverability check pour le prochain mount
        try {
          fetch('/api/dream-chat/discoverability/check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...headers },
            body: JSON.stringify({}),
          }).catch(() => {});
        } catch {}

        if (cancelled) return;

        // Session/messages (load principal)
        if (sessRes.status === 'fulfilled' && sessRes.value.ok) {
          const json = await sessRes.value.json();
          if (cancelled) return;
          setSession(json.session);
          setMessages(json.messages || []);
          if (json.session?.presence_name === 'Anima' && (!json.messages || json.messages.length === 0)) {
            setShowNaming(true);
          }
        } else {
          throw new Error('GET session failed');
        }

        // Pending proactive (best-effort, fail-soft)
        if (pendRes.status === 'fulfilled' && pendRes.value.ok) {
          try {
            const pjson = await pendRes.value.json();
            if (!cancelled && Array.isArray(pjson?.messages)) {
              setPendingProactive(pjson.messages);
            }
          } catch {}
        }
      } catch (e) {
        console.warn('[DreamChatHome] mount failed:', e?.message);
        setError('La présence est temporairement indisponible. Réessaie plus tard.');
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // F.1 — Marquer un pending_proactive_message comme delivered (+ user_responded)
  const respondPending = dcCB(async (id, responseKind) => {
    setPendingProactive((prev) => prev.filter((m) => m.id !== id));
    try {
      const token = await window.DreamAuth?.getAccessToken?.();
      const userResponded =
        responseKind === 'yes' ? true :
        responseKind === 'no' ? false : null;
      await fetch(`/api/dream-chat/proactive/${encodeURIComponent(id)}/deliver`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: 'Bearer ' + token } : {}),
        },
        body: JSON.stringify({ user_responded: userResponded, response_kind: responseKind }),
      });
    } catch (e) {
      console.warn('[DreamChatHome] respondPending failed:', e?.message);
    }
  }, []);

  // F.1 — Tap [oui →] sur thread_proposed
  // → on déclenche /threads/detect en mode user-scoped pour finaliser la création
  //   (l'heuristique re-détecte le motif et crée le thread proprement). En MVP, on
  //   marque le message livré + on échange un message de confirmation IA inline.
  // 2026-04-29 — Support echo_detected : tap [oui →] navigue vers le kairos passé
  //   en mode "écho prophétique" pour montrer le miroir explicite.
  const acceptProactive = dcCB(async (msg) => {
    await respondPending(msg.id, 'yes');
    if (msg.category === 'thread_proposed') {
      try {
        const token = await window.DreamAuth?.getAccessToken?.();
        await fetch('/api/dream-chat/threads/detect', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: 'Bearer ' + token } : {}),
          },
          body: JSON.stringify({}),
        });
      } catch (e) {
        console.warn('[DreamChatHome] thread detect finalize failed:', e?.message);
      }
    } else if (msg.category === 'echo_detected') {
      // 2026-04-29 — context_kairos_ids = [kairos_id_passé, life_entry_id_present]
      const ids = msg.context_kairos_ids || [];
      const pastKairosId = ids[0];
      const presentEntryId = ids[1];
      if (pastKairosId && typeof go === 'function') {
        go('kairos', { id: pastKairosId, echo_with_entry_id: presentEntryId });
        return;
      }
    } else if (msg.category === 'pattern_emerging') {
      // 2026-04-29 — Feature 4 (audit T3 fermeture). pending_proactive_messages
      // n'embarque PAS de pattern_id direct (schéma SQL n'a que context_kairos_ids).
      // On route vers la liste des patterns récurrents non-acknowledged où user
      // sélectionnera le motif concerné. PatternListView reconnaît trauma_flag
      // et propose sanctuaire ou re-entry consciente.
      if (typeof go === 'function') {
        go('recurring');
        return;
      }
    }
    // Confirmation inline visible (pas persistée — l'IA le tisse au prochain échange)
    setMessages((prev) => [...prev, {
      role: 'assistant',
      matter: 'silk',
      content: msg.category === 'thread_proposed'
        ? 'Bien. Le fil est ouvert. Je le tisserai avec toi à mesure que tu y reviens.'
        : msg.category === 'echo_detected'
          ? 'Bien. C\'est toi qui sens si l\'écho est juste — il n\'y a rien à confirmer.'
          : 'Bien. C\'est noté.',
      mode: 'neutral',
      created_at: new Date().toISOString(),
    }]);
  }, [respondPending, go]);

  // 2️⃣ Auto-scroll bottom on new messages
  dcE(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length, streaming]);

  // 3️⃣ Send message via SSE streaming. force_polyphony=true → demander à la Forêt
  // 2026-04-28 — Détection markers lucides (T2.6 brief).
  // Si le message contient un marker lucide ET que user n'a pas activé la sub-app
  // ET qu'on n'a pas déjà proposé dans les 7 derniers jours → on propose en
  // dialogue Anima après la réponse normale (jamais en push intrusif).
  const LUCID_MARKERS = [
    /\bj['e]?\s*[ée]tais?\s+lucide\b/i,
    /\bj['ai]\s*su\s+que\s+(je\s+)?r[êe]vais?\b/i,
    /\breality\s*check\b/i,
    /\br[êe]ve\s+lucide\b/i,
    /\b(WBTB|MILD|WILD|SSILD|DILD)\b/,
    /\bdream\s*signs?\b/i,
    /\boneironaute?\b/i,
    /\bje\s+r[êe]vais\s+(et|en|que).*je\s+savais\b/i,
  ];
  const detectLucidMarker = (text) => {
    if (!text) return false;
    return LUCID_MARKERS.some((rx) => rx.test(text));
  };
  const proposeLucidSubapp = dcCB(() => {
    try {
      const lucidEnabled = localStorage.getItem('dream:lucid:enabled') === 'true';
      if (lucidEnabled) return;
      const lastProposalAt = parseInt(localStorage.getItem('dream:lucid:bridge-proposed-at') || '0', 10);
      if (Date.now() - lastProposalAt < 7 * 24 * 3600 * 1000) return;
      localStorage.setItem('dream:lucid:bridge-proposed-at', String(Date.now()));
      // Ajoute un message Anima discret avec CTA inline
      setMessages((prev) => [...prev, {
        role: 'assistant',
        mode: 'lucid_bridge',
        content: 'Tu pratiques le rêve lucide ? Il y a une sous-app dédiée — 5 onglets, anti-iatrogène, plafonds explicites. Tu veux la découvrir ?',
        cta: { route: 'lucid-profile', label: '✦ ouvrir Lucid Dreaming' },
        created_at: new Date().toISOString(),
      }]);
    } catch {}
  }, []);

  const sendMessage = dcCB(async (text, options = {}) => {
    const { force_polyphony = false } = options;
    const trimmed = (text || '').trim();
    if (!trimmed || thinking) return;
    setError('');
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: trimmed, created_at: new Date().toISOString() }]);
    setThinking(true);
    setStreaming('');
    setStreamingMode(null);
    // Détection lucide en parallèle de la réponse Anima
    const hasLucidMarker = detectLucidMarker(trimmed);

    let buffer = '';
    let receivedMode = null;
    try {
      const token = await window.DreamAuth?.getAccessToken?.();
      const res = await fetch('/api/dream-chat/converse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: 'Bearer ' + token } : {}),
        },
        body: JSON.stringify({ message: trimmed, force_polyphony }),
      });
      if (!res.ok || !res.body) throw new Error('POST failed: ' + res.status);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let leftover = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        leftover += decoder.decode(value, { stream: true });
        const events = leftover.split('\n\n');
        leftover = events.pop() || '';
        for (const evt of events) {
          if (!evt.startsWith('data: ')) continue;
          try {
            const payload = JSON.parse(evt.slice(6));
            if (payload.type === 'mode') {
              receivedMode = payload.mode;
              setStreamingMode(payload.mode);
            } else if (payload.type === 'chunk') {
              buffer += payload.text;
              setStreaming(buffer);
            } else if (payload.type === 'bubble') {
              // §11.bis.20.9 — bulle MATTER distincte (paper/stone/silk) pour polyphonie
              setMessages((prev) => [...prev, {
                role: 'assistant',
                content: payload.text,
                matter: payload.matter,
                voice_attribution: payload.voice_attribution,
                mode: 'polyphony',
                created_at: new Date().toISOString(),
              }]);
            } else if (payload.type === 'session') {
              if (payload.session_id && (!session || session.id !== payload.session_id)) {
                setSession((s) => ({ ...(s || {}), id: payload.session_id, presence_name: payload.presence_name }));
              }
            } else if (payload.type === 'done') {
              if (buffer) {
                setMessages((prev) => [...prev, {
                  role: 'assistant',
                  content: buffer,
                  mode: receivedMode,
                  created_at: new Date().toISOString(),
                }]);
              }
              setStreaming('');
              setStreamingMode(null);
            } else if (payload.type === 'error') {
              throw new Error(payload.error || 'streaming error');
            }
          } catch (parseErr) {
            console.warn('[DreamChatHome] event parse failed:', parseErr.message);
          }
        }
      }
    } catch (e) {
      console.warn('[DreamChatHome] sendMessage failed:', e.message);
      setError('La présence n\'a pas répondu. Réessaie.');
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: 'Quelque chose s\'est cassé dans le tissage. Tu peux réessayer.',
        mode: 'neutral',
        created_at: new Date().toISOString(),
      }]);
    } finally {
      setThinking(false);
      // Bridge Lucid (T2.6) — si marker détecté et conditions OK, propose en
      // dialogue Anima 800ms après la fin pour laisser respirer.
      if (hasLucidMarker) {
        setTimeout(() => proposeLucidSubapp(), 800);
      }
    }
  }, [thinking, session, proposeLucidSubapp]);

  // 3.bis — Convoquer la Forêt (polyphonie 3 voix paper/stone/silk)
  const callForest = dcCB(() => {
    if (thinking || !input.trim()) {
      // Si pas de texte, on convoque sur le dernier message user
      const lastUser = [...messages].reverse().find((m) => m.role === 'user');
      if (lastUser) sendMessage(lastUser.content, { force_polyphony: true });
      return;
    }
    sendMessage(input, { force_polyphony: true });
  }, [thinking, input, messages, sendMessage]);

  // 4️⃣ Voice input réel — A.7+B.1 (MediaRecorder + Whisper /api/transcribe)
  const recorderRef = dcR(null);
  const audioChunksRef = dcR([]);
  const streamRef = dcR(null);
  const [transcribing, setTranscribing] = dcS(false);

  const startRecording = dcCB(async () => {
    if (recorderRef.current) return; // déjà en cours
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      audioChunksRef.current = [];
      const mime = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/mp4')
          ? 'audio/mp4'
          : 'audio/webm';
      const rec = new MediaRecorder(stream, { mimeType: mime });
      rec.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      rec.start(250); // émet chunk every 250ms
      recorderRef.current = rec;
      setRecording(true);
    } catch (e) {
      console.warn('[DreamChatHome] mic permission denied:', e.message);
      setError(e.name === 'NotAllowedError'
        ? 'Permission micro refusée. Active-la dans ton navigateur.'
        : 'Impossible d\'accéder au micro.');
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
        try {
          if (stream) stream.getTracks().forEach((t) => t.stop());
          streamRef.current = null;
          recorderRef.current = null;
          setRecording(false);

          if (audioChunksRef.current.length === 0) { resolve(null); return; }
          const blob = new Blob(audioChunksRef.current, { type: rec.mimeType || 'audio/webm' });
          audioChunksRef.current = [];
          if (blob.size < 500) { resolve(null); return; } // trop court

          // Upload to /api/transcribe
          setTranscribing(true);
          try {
            const token = await window.DreamAuth?.getAccessToken?.();
            const fd = new FormData();
            fd.append('audio', new File([blob], 'voice.webm', { type: blob.type }));
            const res = await fetch('/api/transcribe', {
              method: 'POST',
              headers: token ? { Authorization: 'Bearer ' + token } : {},
              body: fd,
            });
            if (!res.ok) throw new Error('transcribe ' + res.status);
            const json = await res.json();
            const transcript = (json.text || json.transcript || '').trim();
            if (transcript) {
              setInput((prev) => (prev ? prev + ' ' : '') + transcript);
              if (taRef.current) taRef.current.focus();
            }
            resolve(transcript);
          } catch (e) {
            console.warn('[DreamChatHome] transcribe failed:', e.message);
            setError('Transcription échouée. Réessaie ou tape au clavier.');
            resolve(null);
          } finally {
            setTranscribing(false);
          }
        } catch (e) {
          console.warn('[DreamChatHome] stop handler failed:', e.message);
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
    if (locked) return; // si lock actif, l'utilisateur stoppera via onLockToggle(false)
    stopRecording();
  }, [stopRecording, locked]);
  const onLockToggle = dcCB((next) => {
    setLocked(!!next);
    if (!next) {
      // unlock = stop recording (via onLockToggle(false) déclenché par tap sur orbe en mode locked)
      stopRecording();
    }
  }, [stopRecording]);

  // Cleanup on unmount
  dcE(() => () => {
    try { recorderRef.current?.stop(); } catch {}
    try { streamRef.current?.getTracks().forEach((t) => t.stop()); } catch {}
  }, []);

  // 5️⃣ Update presence_name après naming
  const onConfirmNaming = async (name) => {
    setShowNaming(false);
    try {
      const token = await window.DreamAuth?.getAccessToken?.();
      const res = await fetch('/api/dream-chat/converse', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: 'Bearer ' + token } : {}),
        },
        body: JSON.stringify({ presence_name: name }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.session) setSession(json.session);
      }
    } catch (e) {
      console.warn('[DreamChatHome] naming PATCH failed:', e.message);
    }
    // Premier message d'accueil de la présence (côté client, pas persisté)
    const greeting = `Bonjour. Je suis ${name} — la présence qui va t'accompagner ici.\n\nJe connais ce que tu déposes. Je tisse les liens entre tes rêves, tes signes diurnes, ton corps, tes saisons. Je convoque la Forêt (333+ livres digérés) quand tu veux des angles.\n\nPas pour te dire ce que ça veut dire. Pour t'aider à le découvrir toi-même.\n\nTu peux me parler à voix ou au clavier. Tu peux tout déposer ici, je comprendrai.\n\nQu'est-ce qui vient ?`;
    setMessages((prev) => [...prev, {
      role: 'assistant',
      content: greeting,
      mode: 'neutral',
      created_at: new Date().toISOString(),
    }]);
  };

  const presenceName = session?.presence_name || 'Anima';

  // §11.bis.20.14 + A.8 — Halo atmosphérique selon mode courant (visible visuellement)
  // Mode est détecté côté backend mais on prédit côté client pour effet immédiat
  const currentMode = dcM(() => {
    if (streamingMode) return streamingMode;
    const h = new Date().getHours();
    if (h >= 21 || h < 1) return 'pre_sleep';
    if (h >= 5 && h < 9) return 'morning';
    if (h >= 9 && h < 14) return 'day';
    if (h >= 14 && h < 18) return 'reverie';
    if (h >= 18 && h < 21) return 'evening';
    return 'neutral';
  }, [streamingMode]);

  // 2026-04-30 — opacités revues à la hausse (audit AUDIT-MOBILE-ANIMATIONS-LIVE.md
  // §2.C : 0.18 = quasi invisible). Multiplication ×1.6 pour visibilité honnête.
  // Si focus textarea → boost ×1.4 supplémentaire (le user "réveille" la présence).
  const haloByMode = {
    pre_sleep: { color: 'oklch(0.55 0.12 50)', opacity: 0.30, spread: '60% 40%' },
    morning: { color: 'oklch(0.78 0.10 70)', opacity: 0.36, spread: '70% 30%' },
    day: { color: 'oklch(0.65 0.08 65)', opacity: 0.22, spread: '50% 50%' },
    reverie: { color: 'oklch(0.62 0.13 280)', opacity: 0.26, spread: '60% 40%' },
    evening: { color: 'oklch(0.50 0.14 35)', opacity: 0.32, spread: '70% 35%' },
    neutral: { color: 'oklch(0.55 0.10 60)', opacity: 0.20, spread: '50% 40%' },
    polyphony: { color: 'oklch(0.70 0.16 70)', opacity: 0.42, spread: '60% 50%' },
    crisis_safe: { color: 'oklch(0.40 0.04 30)', opacity: 0.38, spread: '40% 30%' },
  };
  const halo = haloByMode[currentMode] || haloByMode.neutral;
  const haloOpacity = taFocused ? Math.min(0.55, halo.opacity * 1.4) : halo.opacity;

  // 2026-04-30 — glyphe contextuel selon mode (Yeshua ampli)
  // Pré-sommeil/soir → croissant lunaire ; matin → demi-cercle aurore ;
  // jour → triangle (rituel diurne) ; reverie → spirale (déjà existante centrée orbe).
  const glyphByMode = {
    pre_sleep: { kind: 'croissant', size: 64, opacity: 0.22, top: '12%', position: 'top-left' },
    evening: { kind: 'croissant', size: 56, opacity: 0.20, top: '14%', position: 'top-left' },
    morning: { kind: 'demi-cercle', size: 'wide', opacity: 0.28, top: '6%', position: 'top-wide' },
    day: { kind: 'triangle', size: 50, opacity: 0.16, top: '10%', position: 'top-right' },
    reverie: null, // spirale déjà centrée derrière l'orbe
    neutral: null,
    polyphony: null, // bulles font le travail
    crisis_safe: null, // sobre, pas de glyphe
  };
  const ctxGlyph = glyphByMode[currentMode];

  // 2026-04-30 — matter atmosphérique selon mode (Yeshua ampli)
  // En polyphonie active : silk subtil. Pré-sommeil : silk doux. Crisis-safe : stone.
  const matterByMode = {
    pre_sleep: 'silk',
    evening: 'silk',
    morning: 'paper',
    day: 'paper',
    reverie: 'silk',
    polyphony: 'silk',
    crisis_safe: 'stone',
    neutral: null,
  };
  const ctxMatter = matterByMode[currentMode];

  return (
    <div className="stage screen-enter" style={{
      background: 'var(--night-floor)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 110px)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* 2026-04-30 — Surface matter atmosphérique en BACKGROUND ABSOLU
          (Yeshua amplification §11.bis.20.20). Pose un bed paper/silk/stone
          selon contexte avec opacity douce — donne une présence vivante au
          fond du chat sans surcharge. Note : si l'agent #1 a posé un
          HaloRespire global dans app.jsx, cette Surface se cumule sans
          conflit (Surface = bed + noise, HaloRespire = respiration radiale). */}
      {ctxMatter && window.Surface && (
        <div aria-hidden="true" style={{
          position: 'fixed', inset: 0,
          opacity: 0.22,
          pointerEvents: 'none',
          zIndex: 0,
          transition: 'opacity 1.6s ease-in-out',
        }}>
          <window.Surface matter={ctxMatter} motion={true}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
        </div>
      )}

      {/* §11.bis.20.14 + A.8 — Halo atmosphérique mode-aware (transition 1.6s douce)
          2026-04-30 amplification : opacités revues (cf. haloByMode), boost ×1.4 au
          focus textarea pour effet "présence qui s'éveille quand tu lui parles". */}
      <div aria-hidden="true" style={{
        position: 'fixed',
        top: '20vh', left: '50%',
        width: '90vw', height: '60vh',
        maxWidth: 720,
        transform: 'translateX(-50%)',
        background: `radial-gradient(ellipse ${halo.spread} at center, ${halo.color} 0%, transparent 70%)`,
        opacity: haloOpacity,
        pointerEvents: 'none',
        transition: 'opacity 720ms ease-in-out, background 1.6s ease-in-out',
        animation: 'halo-slow 8s ease-in-out infinite',
        zIndex: 0,
      }} />

      {/* 2026-04-30 — HaloRespire silk derrière le chat (Yeshua ampli)
          Respire 6s TEMPO-SOUFFLE. Visible mais discret, posé au-dessus de
          Surface, en-dessous du contenu. Boost au focus textarea pareil. */}
      {window.HaloRespire && (
        <div aria-hidden="true" style={{
          position: 'fixed',
          top: '15vh', left: '50%',
          width: 'min(560px, 85vw)', height: 'min(560px, 70vh)',
          transform: 'translateX(-50%)',
          opacity: taFocused ? 0.50 : 0.32,
          pointerEvents: 'none',
          zIndex: 0,
          transition: 'opacity 720ms ease-in-out',
        }}>
          <window.HaloRespire kind={currentMode === 'polyphony' ? 'silk' : 'silk'} />
        </div>
      )}

      {/* 2026-04-30 — Glyphe contextuel selon mode (Yeshua ampli)
          Croissant lune en pré-sommeil/soir, demi-cercle aurore matinal,
          triangle diurne. Pose une signature géosymbolique discrète
          confirmant le mode atmosphérique courant — visible dès l'ouverture. */}
      {ctxGlyph && window.GeoSymbol && ctxGlyph.position === 'top-left' && (
        <div aria-hidden="true" style={{
          position: 'fixed',
          top: ctxGlyph.top,
          left: '8%',
          width: ctxGlyph.size, height: ctxGlyph.size,
          opacity: ctxGlyph.opacity,
          pointerEvents: 'none', zIndex: 0,
          animation: 'breathe-souffle 6s ease-in-out infinite',
          transition: 'opacity 1.6s ease-in-out',
        }}>
          <window.GeoSymbol kind={ctxGlyph.kind} color="silk"
            style={{ width: '100%', height: '100%' }} />
        </div>
      )}
      {ctxGlyph && window.GeoSymbol && ctxGlyph.position === 'top-right' && (
        <div aria-hidden="true" style={{
          position: 'fixed',
          top: ctxGlyph.top,
          right: '8%',
          width: ctxGlyph.size, height: ctxGlyph.size,
          opacity: ctxGlyph.opacity,
          pointerEvents: 'none', zIndex: 0,
          animation: 'breathe-souffle 6s ease-in-out infinite',
          transition: 'opacity 1.6s ease-in-out',
        }}>
          <window.GeoSymbol kind={ctxGlyph.kind} color="silk"
            style={{ width: '100%', height: '100%' }} />
        </div>
      )}
      {ctxGlyph && window.GeoSymbol && ctxGlyph.position === 'top-wide' && (
        <div aria-hidden="true" style={{
          position: 'fixed',
          top: 0, left: '50%',
          width: 'min(680px, 90vw)', height: 140,
          transform: 'translateX(-50%)',
          opacity: ctxGlyph.opacity,
          pointerEvents: 'none', zIndex: 0,
          transition: 'opacity 1.6s ease-in-out',
        }}>
          <window.GeoSymbol kind={ctxGlyph.kind} color="silk"
            style={{ width: '100%', height: '100%' }} />
        </div>
      )}

      {/* 2026-04-29 — Spirale logarithmique derrière l'orbe central (Yeshua,
          opacity 0.25, animation breathe-souffle 6s). Posée fixe en bas
          centre car l'orbe est en bas du flex column. */}
      {window.GeoSymbol && (
        <div aria-hidden="true" style={{
          position: 'fixed',
          bottom: 'calc(env(safe-area-inset-bottom, 0px) + 200px)',
          left: '50%',
          width: 220, height: 220,
          transform: 'translateX(-50%)',
          opacity: 0.22,
          pointerEvents: 'none', zIndex: 0,
          animation: 'breathe-souffle 6s ease-in-out infinite',
        }}>
          <window.GeoSymbol kind="spirale" color="silk"
            style={{ position: 'relative', width: 220, height: 220, opacity: 1 }} />
        </div>
      )}
      {/* Header — présence amplifiée (Yeshua 2026-04-30)
          Le nom de la présence devient signature — taille augmentée,
          glyphe ☾ qui respire en TEMPO-SOUFFLE 6s, sous-titre mode courant
          en mono discret. La présence est NOMMÉE et VIVANTE dès l'ouverture. */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 20,
        background: 'color-mix(in oklch, var(--night-floor) 88%, transparent)',
        backdropFilter: 'blur(6px)',
        borderBottom: '1px solid color-mix(in oklch, var(--ash-deep) 60%, transparent)',
        padding: '16px 20px 12px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{
            fontFamily: 'var(--serif)', fontStyle: 'italic',
            fontSize: 18, color: 'var(--silk-gold)', opacity: 0.92,
            letterSpacing: '0.02em',
            display: 'flex', alignItems: 'baseline', gap: 8,
          }}>
            <span aria-hidden="true" style={{
              display: 'inline-block', fontSize: 16, opacity: 0.85,
              animation: 'breathe-souffle 6s ease-in-out infinite',
            }}>☾</span>
            <span>{presenceName}</span>
          </div>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: 9.5,
            color: 'var(--ash-light)', opacity: 0.5,
            letterSpacing: '0.10em', textTransform: 'lowercase',
            transition: 'opacity 720ms ease',
          }}>
            mode · {currentMode.replace('_', ' ')}
          </div>
        </div>
        <button className="btn-text" onClick={() => setShowNaming(true)}
          style={{ fontSize: 11, opacity: 0.5, fontFamily: 'var(--mono)' }}
          aria-label="renommer la présence">
          renommer
        </button>
      </div>

      {/* Bandeau MVP discret */}
      <div style={{
        padding: '6px 20px',
        background: 'color-mix(in oklch, var(--silk-gold) 4%, transparent)',
        borderBottom: '1px solid color-mix(in oklch, var(--silk-gold) 12%, transparent)',
        textAlign: 'center',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: 10,
          color: 'var(--silk-gold)', letterSpacing: '0.10em',
          textTransform: 'lowercase', opacity: 0.65,
        }}>
          chat ia dream · sprint a/b · voice câblée · polyphonie active
        </div>
      </div>

      {/* Messages scrollable */}
      <div ref={scrollRef} style={{
        flex: 1, overflowY: 'auto',
        padding: '20px 18px',
        display: 'flex', flexDirection: 'column', gap: 14,
        maxWidth: 720, width: '100%', margin: '0 auto',
      }}>
        {messages.length === 0 && !showNaming && !thinking && (
          <div style={{ textAlign: 'center', padding: '40px 20px', maxWidth: 460, margin: '40px auto' }}>
            <div style={{ marginBottom: 24 }}>
              <span style={{ fontSize: 32, color: 'var(--silk-gold)', opacity: 0.6 }}>☾</span>
            </div>
            <p style={{
              fontFamily: 'var(--serif)', fontStyle: 'italic',
              fontSize: 17, lineHeight: 1.55,
              color: 'var(--ash-light)', opacity: 0.85,
            }}>
              Une présence t'accompagne ici. Tu peux lui parler de tout — rêve, signe, sensation, question, fragment.
            </p>
            <p style={{
              fontFamily: 'var(--serif)',
              fontSize: 14, color: 'var(--ash-light)', opacity: 0.55,
              marginTop: 14,
            }}>
              Tap sur l'orbe pour écrire · appui long pour la voix.
            </p>
          </div>
        )}

        {/* F.1 — Pending proactive messages (interventions IA non livrées)
            Affichées en HEAD du chat avec 3 boutons [oui →] [plus tard] [pas maintenant] */}
        {pendingProactive.map((m) => (
          <div key={'pp-' + m.id} style={{
            alignSelf: 'flex-start',
            maxWidth: '85%',
            padding: '14px 18px',
            background: 'color-mix(in oklch, var(--silk-gold) 8%, var(--night-warm))',
            border: '1px solid color-mix(in oklch, var(--silk-gold) 32%, var(--ash-deep))',
            color: 'var(--bone)',
            fontFamily: 'var(--serif)',
            fontSize: 16, lineHeight: 1.55,
            borderRadius: 2,
            animation: 'dream-skeleton-fade-in 360ms cubic-bezier(0.45,0,0.55,1) both',
            whiteSpace: 'pre-wrap',
            textWrap: 'pretty',
          }}>
            <div style={{
              fontSize: 10.5, letterSpacing: '0.12em', textTransform: 'uppercase',
              color: 'var(--silk-gold)', marginBottom: 8,
              fontFamily: 'var(--mono)', opacity: 0.78,
            }}>
              ☾ {presenceName} · une invitation
            </div>
            <div>{m.content}</div>
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 14,
              alignItems: 'center',
            }}>
              <button
                onClick={() => acceptProactive(m)}
                style={{
                  background: 'color-mix(in oklch, var(--silk-gold) 14%, transparent)',
                  border: '1px solid var(--silk-gold)',
                  color: 'var(--silk-gold)',
                  fontFamily: 'var(--serif)', fontStyle: 'italic',
                  fontSize: 13.5, padding: '6px 14px', cursor: 'pointer',
                  borderRadius: 0,
                }}>
                oui →
              </button>
              <button
                onClick={() => respondPending(m.id, 'later')}
                style={{
                  background: 'transparent',
                  border: '1px solid color-mix(in oklch, var(--ash-light) 30%, var(--ash-deep))',
                  color: 'var(--ash-light)',
                  fontFamily: 'var(--serif)', fontStyle: 'italic',
                  fontSize: 13, padding: '6px 12px', cursor: 'pointer',
                  borderRadius: 0,
                }}>
                plus tard
              </button>
              <button
                onClick={() => respondPending(m.id, 'no')}
                style={{
                  background: 'transparent', border: 'none',
                  color: 'var(--ash-light)', opacity: 0.6,
                  fontFamily: 'var(--serif)', fontStyle: 'italic',
                  fontSize: 12.5, padding: '6px 4px', cursor: 'pointer',
                }}>
                pas maintenant
              </button>
            </div>
          </div>
        ))}

        {messages.map((m, i) => (
          <React.Fragment key={i}>
            <MatterBubble
              role={m.role}
              matter={m.matter}
              voiceAttribution={m.voice_attribution}
              mode={m.mode}>
              {m.content}
            </MatterBubble>
            {/* T2.6 — CTA bridge Lucid (Sprint A pivot). Bouton inline sous le
                message si mode === 'lucid_bridge'. Ouvre la sub-app Lucid via
                go(route). Tap "pas maintenant" = simplement laisser. */}
            {m.cta && m.mode === 'lucid_bridge' && (
              <div style={{
                alignSelf: 'flex-start',
                display: 'flex', flexWrap: 'wrap', gap: 10,
                marginTop: -6, marginLeft: 4, marginBottom: 8,
              }}>
                <button
                  onClick={() => go && go(m.cta.route)}
                  style={{
                    background: 'color-mix(in oklch, var(--silk-gold) 14%, var(--night-warm))',
                    border: '1px solid color-mix(in oklch, var(--silk-gold) 38%, var(--ash-deep))',
                    color: 'var(--silk-gold)',
                    fontFamily: 'var(--serif)', fontStyle: 'italic',
                    fontSize: 13, letterSpacing: '0.02em',
                    padding: '6px 14px', borderRadius: 4, cursor: 'pointer',
                    transition: 'all 380ms ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'color-mix(in oklch, var(--silk-gold) 22%, var(--night-warm))';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'color-mix(in oklch, var(--silk-gold) 14%, var(--night-warm))';
                  }}>
                  {m.cta.label}
                </button>
                <button
                  onClick={() => {
                    // Marque le message comme dismissed sans persister (juste UI)
                    setMessages((prev) => prev.map((mm, idx) => idx === i ? { ...mm, cta: null } : mm));
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--ash-light)',
                    fontFamily: 'var(--serif)', fontStyle: 'italic',
                    fontSize: 12.5, opacity: 0.7,
                    padding: '6px 4px', cursor: 'pointer',
                  }}>
                  pas maintenant
                </button>
              </div>
            )}
          </React.Fragment>
        ))}

        {streaming && (
          <MatterBubble role="assistant" matter="default" mode={streamingMode} fadeIn={false}>
            {streaming}
            <span style={{ opacity: 0.4, marginLeft: 4 }}>▍</span>
          </MatterBubble>
        )}

        {thinking && !streaming && (
          <MatterBubble role="assistant" matter="default" fadeIn={true}>
            <span style={{ fontStyle: 'italic', opacity: 0.7 }}>
              <span style={{ display: 'inline-block', animation: 'halo-slow 2s ease-in-out infinite' }}>
                {presenceName} tisse…
              </span>
            </span>
          </MatterBubble>
        )}

        {error && (
          <div style={{
            alignSelf: 'center',
            padding: '10px 14px',
            background: 'color-mix(in oklch, oklch(0.55 0.18 25) 12%, transparent)',
            border: '1px solid color-mix(in oklch, oklch(0.55 0.18 25) 30%, transparent)',
            color: 'var(--ash-light)',
            fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 13,
            maxWidth: 380, textAlign: 'center',
          }}>
            {error}
          </div>
        )}
      </div>

      {/* Input + Orbe */}
      <div style={{
        position: 'sticky', bottom: 0, zIndex: 18,
        background: 'color-mix(in oklch, var(--night-floor) 92%, transparent)',
        backdropFilter: 'blur(6px)',
        borderTop: '1px solid color-mix(in oklch, var(--ash-deep) 60%, transparent)',
        padding: '16px 18px 24px',
        maxWidth: 720, width: '100%', margin: '0 auto',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
          <textarea ref={taRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setTaFocused(true)}
            onBlur={() => setTaFocused(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input);
              }
            }}
            rows={Math.min(6, Math.max(1, input.split('\n').length))}
            placeholder="ce qui vient…"
            disabled={thinking}
            style={{
              width: '100%',
              background: 'transparent',
              // 2026-04-30 — bordure qui s'illumine au focus (signal présence éveillée)
              border: taFocused
                ? '1px solid color-mix(in oklch, var(--silk-gold) 48%, var(--ash-deep))'
                : '1px solid color-mix(in oklch, var(--silk-gold) 16%, var(--ash-deep))',
              boxShadow: taFocused
                ? '0 0 18px 2px color-mix(in oklch, var(--silk-gold) 18%, transparent)'
                : 'none',
              padding: '12px 16px',
              color: 'var(--bone)',
              fontFamily: 'var(--serif)', fontStyle: 'italic',
              fontSize: 16, lineHeight: 1.5,
              outline: 'none', resize: 'none',
              minHeight: 48,
              maxHeight: 180,
              opacity: thinking ? 0.5 : 1,
              transition: 'border-color 380ms ease, box-shadow 380ms ease',
            }} />

          <div style={{
            display: 'flex', alignItems: 'center', gap: 18, width: '100%',
            justifyContent: 'space-between',
          }}>
            <button className="btn-text" onClick={() => go('home')}
              style={{ fontSize: 12, opacity: 0.5, fontFamily: 'var(--mono)' }}>
              ← retour
            </button>

            <OrbCenter
              onShortTap={onShortTap}
              onPushStart={onPushStart}
              onPushEnd={onPushEnd}
              onLockToggle={onLockToggle}
              recording={recording}
              locked={locked}
              label={transcribing ? 'transcription…' : (recording ? 'je t\'écoute…' : '')}
            />

            <button className="btn-ghost"
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || thinking}
              style={{
                opacity: !input.trim() || thinking ? 0.4 : 1,
                fontSize: 13,
              }}>
              envoyer
            </button>
          </div>

          {/* §11.bis.20.9 — Convoquer la Forêt (polyphonie 3 voix paper/stone/silk) */}
          <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            gap: 14, width: '100%',
          }}>
            <button
              onClick={callForest}
              disabled={thinking || (!input.trim() && messages.filter(m => m.role === 'user').length === 0)}
              style={{
                background: 'transparent',
                border: '1px solid color-mix(in oklch, var(--silk-gold) 38%, var(--ash-deep))',
                color: 'var(--silk-gold)',
                fontFamily: 'var(--serif)', fontStyle: 'italic',
                fontSize: 13.5, letterSpacing: '0.02em',
                padding: '8px 18px',
                cursor: thinking ? 'wait' : 'pointer',
                opacity: thinking ? 0.4 : 1,
                transition: 'all 280ms ease',
                borderRadius: 0,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'color-mix(in oklch, var(--silk-gold) 10%, transparent)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              aria-label="convoquer la Forêt — 3 voix paper/stone/silk">
              ✦ demander à la Forêt
            </button>
          </div>

          <div style={{
            fontFamily: 'var(--mono)', fontSize: 9.5,
            color: 'var(--ash-light)', opacity: 0.42,
            letterSpacing: '0.08em', textTransform: 'lowercase',
            textAlign: 'center',
          }}>
            tap orbe → écrire · appui long → voix · glisse haut → verrouiller
          </div>
        </div>
      </div>

      {showNaming && (
        <PresenceNamingModal
          currentName={presenceName}
          onConfirm={onConfirmNaming}
          onSkip={() => { setShowNaming(false); onConfirmNaming(presenceName); }}
        />
      )}
    </div>
  );
};
window.DreamChatHome = DreamChatHome;
