/* global React, window */
// ──────────────────────────────────────────────────────────────
// Dream V1.2 — Loading Primitives (Sprint P0.5 + P1.4 — 2026-04-27)
// Spec : 2_DESIGN.md §11.bis.19
//
// Primitives partagées pour tous les states asynchrones :
//   1. <SkeletonShimmer> — N lignes grisées + shimmer animation
//   2. <LoadingHalo>     — cercle silk-gold qui respire
//   3. <OptimisticToast> — toast bottom-center auto-dismiss
//   4. <SyncStatus>      — badge top-right "syncing… / saved / offline"
//   5. window.DreamPendingMutations[] + helpers — registry global
//
// Discipline :
//  - Palette night + day adaptée via prop `dark`
//  - EB Garamond italic 13-14px, ash-light, ease-tenue 280-380ms
//  - Pas de spinner brutal, jamais de "loading…" générique
//  - Anti-pattern banni : indication non-contextualisée, opacité criarde
// ──────────────────────────────────────────────────────────────

(function setupLoadingPrimitives() {
  const { useEffect, useState, useRef } = React;

  // ── 1) <SkeletonShimmer> ────────────────────────────────────
  // N lignes de skeleton avec shimmer animation 1.6s linear infinite.
  // Background : linear-gradient subtle (ash-deep → ash-mid → ash-deep) en mode dark,
  // (day-paper → day-linen → day-paper) en mode !dark.
  const SkeletonShimmer = ({ width = "100%", height = 16, lines = 1, dark = true, gap = 10, lastLineWidth = "70%" }) => {
    const bgFrom = dark
      ? "color-mix(in oklch, var(--ash-deep) 65%, transparent)"
      : "color-mix(in oklch, var(--day-paper, #EBE2D2) 50%, transparent)";
    const bgMid = dark
      ? "color-mix(in oklch, var(--ash-mid) 55%, transparent)"
      : "color-mix(in oklch, var(--day-linen, #DFD3BF) 75%, transparent)";

    const arr = Array.from({ length: lines });
    return (
      <div style={{ display: "flex", flexDirection: "column", gap, width }}>
        {arr.map((_, i) => (
          <div key={i} style={{
            width: (i === lines - 1 && lines > 1) ? lastLineWidth : "100%",
            height,
            borderRadius: 2,
            background: `linear-gradient(90deg, ${bgFrom} 0%, ${bgMid} 50%, ${bgFrom} 100%)`,
            backgroundSize: "200% 100%",
            animation: "dream-skeleton-shimmer 1.6s linear infinite",
          }} />
        ))}
      </div>
    );
  };

  // ── 2) <LoadingHalo> ────────────────────────────────────────
  // Cercle SVG silk-gold qui respire (opacity 0.3→0.8, scale 1→1.05, 1.6s).
  // Optionnel : message italic 14px ash-light en dessous.
  const LoadingHalo = ({ size = 32, message = null, dark = true }) => {
    const stroke = dark ? "var(--silk-gold)" : "var(--day-clay-warm, #C9B098)";
    const meta = dark ? "var(--ash-light)" : "var(--day-bone-warm, #9F8E7C)";
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
      }}>
        <div aria-hidden="true" style={{
          width: size, height: size, borderRadius: "50%",
          border: "1px solid " + stroke,
          animation: "dream-halo-respire 1.6s ease-in-out infinite",
          willChange: "transform, opacity",
        }} />
        {message && (
          <div style={{
            fontFamily: "var(--serif)", fontStyle: "italic",
            fontSize: 14, color: meta,
            textWrap: "pretty", textAlign: "center", maxWidth: 320,
            opacity: 0.85,
          }}>
            {message}
          </div>
        )}
      </div>
    );
  };

  // ── 3) <OptimisticToast> ────────────────────────────────────
  // Toast bottom-center, ash-deep + paper border, EB Garamond italic 13px.
  // Auto-dismiss après duration ms. Slide-up 280ms ease-tenue.
  const OptimisticToast = ({ text, onDismiss, duration = 3000, tone = "info" }) => {
    useEffect(() => {
      if (!duration || duration < 0) return;
      const t = setTimeout(() => { if (onDismiss) onDismiss(); }, duration);
      return () => clearTimeout(t);
    }, [duration, onDismiss]);

    const borderColor = tone === "error"
      ? "color-mix(in oklch, var(--ember-live) 50%, var(--ash-deep))"
      : "color-mix(in oklch, var(--silk-gold) 28%, var(--ash-deep))";
    const textColor = tone === "error"
      ? "color-mix(in oklch, var(--ember-live) 60%, var(--bone))"
      : "var(--bone)";

    return (
      <div role="status" aria-live="polite" style={{
        position: "fixed",
        bottom: "calc(env(safe-area-inset-bottom, 0px) + 96px)",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 220,
        background: "color-mix(in oklch, var(--ash-deep) 88%, var(--night-floor))",
        border: "1px solid " + borderColor,
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        padding: "10px 18px",
        fontFamily: "var(--serif)", fontStyle: "italic",
        fontSize: 13, lineHeight: 1.5,
        color: textColor,
        textWrap: "pretty",
        maxWidth: "min(420px, calc(100vw - 32px))",
        animation: "dream-toast-slide-up 280ms cubic-bezier(0.45, 0, 0.15, 1) both",
        letterSpacing: "0.01em",
      }}>
        {text}
      </div>
    );
  };

  // ── 4) Global pending-mutations registry + <SyncStatus> ─────
  // Pattern : chaque mutation optimiste push un id ; au retour API → splice.
  // Listeners notifiés via window.dispatchEvent('dream-sync-changed').
  if (!Array.isArray(window.DreamPendingMutations)) {
    window.DreamPendingMutations = [];
  }

  function emitSyncChanged() {
    try { window.dispatchEvent(new Event("dream-sync-changed")); } catch {}
  }

  window.dreamSyncBegin = function (label) {
    const id = "m-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7);
    window.DreamPendingMutations.push({ id, label: label || "sync", at: Date.now() });
    emitSyncChanged();
    return id;
  };

  window.dreamSyncEnd = function (id, opts = {}) {
    const idx = window.DreamPendingMutations.findIndex(m => m.id === id);
    if (idx >= 0) window.DreamPendingMutations.splice(idx, 1);
    if (opts.error) {
      try {
        window.__dreamLastSyncError = { at: Date.now(), msg: opts.error };
      } catch {}
    }
    emitSyncChanged();
  };

  // <SyncStatus> — Petit badge top discret, 4 states.
  const SyncStatus = ({ status }) => {
    const [computedStatus, setComputedStatus] = useState(status || null);
    const [showSavedFlash, setShowSavedFlash] = useState(false);
    const lastCountRef = useRef(0);

    useEffect(() => {
      if (status) { setComputedStatus(status); return; }

      const handler = () => {
        const offline = (typeof navigator !== "undefined") && navigator.onLine === false;
        const count = window.DreamPendingMutations?.length || 0;
        if (offline) {
          setComputedStatus({ kind: "offline", count: 0 });
        } else if (count > 0) {
          setComputedStatus({ kind: "syncing", count });
          lastCountRef.current = count;
        } else if (lastCountRef.current > 0) {
          // Vient de finir — flash "saved" 2s
          setComputedStatus({ kind: "saved", count: 0 });
          setShowSavedFlash(true);
          lastCountRef.current = 0;
          setTimeout(() => setShowSavedFlash(false), 2000);
        } else {
          setComputedStatus(null);
        }
      };
      window.addEventListener("dream-sync-changed", handler);
      window.addEventListener("online", handler);
      window.addEventListener("offline", handler);
      handler();
      return () => {
        window.removeEventListener("dream-sync-changed", handler);
        window.removeEventListener("online", handler);
        window.removeEventListener("offline", handler);
      };
    }, [status]);

    if (!computedStatus) return null;
    if (computedStatus.kind === "saved" && !showSavedFlash) return null;

    const kind = computedStatus.kind;
    const count = computedStatus.count || 0;
    const label = kind === "syncing" ? (count > 1 ? `syncing… (${count})` : "syncing…")
                : kind === "saved"   ? "✓ saved"
                : kind === "offline" ? "offline · changes saved locally"
                : kind === "error"   ? "sync failed"
                : "syncing…";

    const color = kind === "syncing" ? "var(--silk-gold)"
                : kind === "saved"   ? "color-mix(in oklch, var(--silk-gold) 70%, var(--bone))"
                : kind === "offline" ? "var(--ash-light)"
                : kind === "error"   ? "var(--ember-live)"
                : "var(--ash-light)";

    return (
      <div role="status" aria-live="polite" aria-label={"sync state: " + kind}
        style={{
          position: "fixed",
          top: "calc(env(safe-area-inset-top, 0px) + 8px)",
          right: 12,
          zIndex: 55, // sous demoBanner (60) et modals (200+)
          fontFamily: "var(--mono)",
          fontSize: 10.5,
          letterSpacing: "0.08em",
          color,
          padding: "3px 9px",
          background: "color-mix(in oklch, var(--ash-deep) 70%, transparent)",
          border: "1px solid color-mix(in oklch, " + color + " 25%, var(--ash-deep))",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          opacity: 0.85,
          transition: "opacity 380ms ease, color 380ms ease",
          pointerEvents: "none",
          textTransform: "lowercase",
        }}>
        {kind === "syncing" && <span style={{
          display: "inline-block", width: 6, height: 6, borderRadius: "50%",
          background: "currentColor",
          marginRight: 6,
          animation: "dream-halo-respire 1.2s ease-in-out infinite",
          verticalAlign: "middle",
        }} />}
        {label}
      </div>
    );
  };

  // ── 5) Inject keyframes once ────────────────────────────────
  // Animations utilisées par les primitives. Idempotent (id check).
  if (typeof document !== "undefined" && !document.getElementById("dream-loading-primitives-css")) {
    const style = document.createElement("style");
    style.id = "dream-loading-primitives-css";
    style.textContent = `
@keyframes dream-skeleton-shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
@keyframes dream-halo-respire {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50%      { opacity: 0.8; transform: scale(1.05); }
}
@keyframes dream-toast-slide-up {
  from { opacity: 0; transform: translate(-50%, 12px); }
  to   { opacity: 1; transform: translate(-50%, 0); }
}
@keyframes dream-skeleton-fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
.dream-skeleton-fade-in {
  animation: dream-skeleton-fade-in 240ms ease-out both;
}
`;
    document.head.appendChild(style);
  }

  // ── Helper: rotating loading messages ───────────────────────
  // Hook : useRotatingMessage(messages, intervalMs)
  // Renvoie un message qui rotate entre les éléments du tableau.
  function useRotatingMessage(messages, intervalMs = 2400) {
    const [idx, setIdx] = useState(0);
    useEffect(() => {
      if (!messages || messages.length < 2) return;
      const t = setInterval(() => setIdx(i => (i + 1) % messages.length), intervalMs);
      return () => clearInterval(t);
    }, [messages, intervalMs]);
    return (messages && messages[idx]) || (messages && messages[0]) || "";
  }

  // ── Expose ──────────────────────────────────────────────────
  Object.assign(window, {
    SkeletonShimmer,
    LoadingHalo,
    OptimisticToast,
    SyncStatus,
    useRotatingMessage,
    // Aliases pour cohérence import : window.DreamLoading.* tolérée
    DreamLoading: {
      SkeletonShimmer, LoadingHalo, OptimisticToast, SyncStatus,
      useRotatingMessage,
    },
  });
})();
