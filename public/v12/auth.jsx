/* global React, supabase */
// ──────────────────────────────────────────────────────────────
// Dream V1.2 — Supabase auth bridge (iframe → Next.js Bearer)
// 2026-04-25 — Yeshua  (rev 2 : password + magic link + demo mode + debug)
//
// Modes :
//   - password (default) : email + password sign in / sign up
//   - magic link (backup) : OTP email link
//   - demo (?demo=1)    : bypass AuthGate, fake user, seed data only
//
// Env vars : window.SUPABASE_URL + window.SUPABASE_ANON_KEY (set inline dans
// index.html via /api/v12-env). Si absentes → mode demo silencieux.
// ──────────────────────────────────────────────────────────────

(function setupDreamAuth() {
  const SUPABASE_URL = window.SUPABASE_URL || "https://rtrkxzcyblgonwgfzovj.supabase.co";
  const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || "";

  const isDemoMode = (() => {
    try { return new URL(location.href).searchParams.get("demo") === "1"; }
    catch { return false; }
  })();

  // No-auth mode if : ?demo=1 OR no supabase JS OR no anon key
  if (isDemoMode || !window.supabase?.createClient || !SUPABASE_ANON_KEY) {
    const reason = isDemoMode ? "demo mode (?demo=1)"
      : !window.supabase ? "supabase-js UMD not loaded"
      : "SUPABASE_ANON_KEY missing";
    console.warn("[DreamAuth] " + reason + " — bypass AuthGate, seed-only mode");
    window.DreamAuth = {
      ready: false,
      noAuth: true,
      mode: "demo",
      getSession: async () => null,
      getAccessToken: async () => null,
      getUser: async () => ({ id: "demo-user", email: "demo@infuse.earth" }),
      signInPassword: async () => ({ error: "auth disabled" }),
      signUpPassword: async () => ({ error: "auth disabled" }),
      signInMagicLink: async () => ({ error: "auth disabled" }),
      signOut: async () => {},
      onAuthChange: () => () => {},
    };
    return;
  }

  // detectSessionInUrl: true is necessary for magic link flow.
  // BUT iframe sandboxes can confuse it — we keep it on but also manually
  // process hash on init in case it's missed.
  const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: "dream-app-supabase-auth",
      flowType: "implicit", // magic link returns access_token in hash (not PKCE which needs code)
    },
  });

  window.DreamSupabase = client;

  window.DreamAuth = {
    ready: true,
    noAuth: false,
    mode: "supabase",
    client,

    async getSession() {
      const { data, error } = await client.auth.getSession();
      if (error) {
        console.warn("[DreamAuth] getSession error:", error.message);
        return null;
      }
      return data?.session || null;
    },

    async getAccessToken() {
      const session = await this.getSession();
      return session?.access_token || null;
    },

    async getUser() {
      const session = await this.getSession();
      return session?.user || null;
    },

    async signInPassword(email, password) {
      const cleanEmail = (email || "").trim().toLowerCase();
      if (!cleanEmail || !password) return { error: "email + password requis" };
      const { data, error } = await client.auth.signInWithPassword({
        email: cleanEmail, password,
      });
      if (error) return { error: error.message };
      return { ok: true, user: data?.user };
    },

    async signUpPassword(email, password) {
      const cleanEmail = (email || "").trim().toLowerCase();
      if (!cleanEmail || !password) return { error: "email + password requis" };
      if (password.length < 6) return { error: "mot de passe : 6 caractères minimum" };
      const { data, error } = await client.auth.signUp({
        email: cleanEmail, password,
        options: { emailRedirectTo: window.location.origin + "/v12/index.html" },
      });
      if (error) return { error: error.message };
      // If email confirmation enabled in Supabase, user.session is null.
      // If disabled (recommended for low-friction), user is signed in immediately.
      const needsConfirm = !data?.session;
      return { ok: true, user: data?.user, needsConfirm };
    },

    async signInMagicLink(email) {
      const cleanEmail = (email || "").trim().toLowerCase();
      if (!cleanEmail) return { error: "email requis" };
      const redirectTo = window.location.origin + "/v12/index.html";
      const { error } = await client.auth.signInWithOtp({
        email: cleanEmail,
        options: { emailRedirectTo: redirectTo },
      });
      if (error) return { error: error.message };
      return { ok: true };
    },

    async signOut() {
      console.log("[DreamAuth] explicit signOut called");
      await client.auth.signOut();
    },

    onAuthChange(cb) {
      const { data } = client.auth.onAuthStateChange((event, session) => {
        try { cb(event, session); } catch (e) { console.error("[DreamAuth] onAuthChange cb error:", e); }
      });
      return () => data?.subscription?.unsubscribe?.();
    },
  };

  // Clean magic-link hash from URL once auth picked it up
  window.DreamAuth.onAuthChange((event) => {
    if (event === "SIGNED_IN" && window.location.hash.includes("access_token")) {
      console.log("[DreamAuth] cleaning access_token from URL");
      try {
        history.replaceState(null, "", window.location.pathname);
      } catch {}
    }
  });
})();

// ── AuthGate React component ──────────────────────────────────
// Wraps the app. While session loading → soft halo. No session → SignIn.
// Session present → renders children.
// CRITICAL : we IGNORE INITIAL_SESSION + TOKEN_REFRESHED events to avoid
// race conditions where the listener flips status back to signed_out
// while getSession() has already returned a valid session.

(function setupAuthGate() {
  const { useState: uAS, useEffect: uAE } = React;

  const SignInScreen = ({ onSignIn }) => {
    const [tab, setTab] = uAS("signin"); // signin | signup | magic
    const [email, setEmail] = uAS("");
    const [password, setPassword] = uAS("");
    const [sending, setSending] = uAS(false);
    const [sent, setSent] = uAS(false);
    const [error, setError] = uAS(null);
    const [info, setInfo] = uAS(null);

    const submit = async () => {
      if (!email.trim() || !email.includes("@")) {
        setError("email valide requis"); return;
      }
      setSending(true); setError(null); setInfo(null);
      let result;
      if (tab === "signin") {
        result = await window.DreamAuth.signInPassword(email, password);
      } else if (tab === "signup") {
        result = await window.DreamAuth.signUpPassword(email, password);
      } else {
        result = await window.DreamAuth.signInMagicLink(email);
      }
      setSending(false);
      if (result.error) {
        setError(result.error);
      } else if (tab === "magic") {
        setSent(true);
      } else if (tab === "signup" && result.needsConfirm) {
        setInfo("compte créé. vérifie ton email pour confirmer.");
      } else {
        // signin success or signup auto-confirmed → onAuthChange will trigger AuthGate
        if (onSignIn) onSignIn();
      }
    };

    return (
      <div className="stage screen-enter" style={{
        background: "var(--night-floor)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--s-5)",
      }}>
        <div className="frame" style={{ maxWidth: 440, width: "100%" }}>
          <div className="text-center" style={{ marginBottom: "var(--s-7)" }}>
            <div style={{
              width: 48, height: 48, margin: "0 auto var(--s-4)",
              borderRadius: "50%",
              border: "1px solid var(--ash-mid)",
              animation: "halo-slow 4s ease-in-out infinite",
            }} />
            <h1 className="h1-seuil" style={{ fontSize: 32 }}>Dream</h1>
            <p className="seuil-italic mt-s" style={{ color: "var(--ash-light)", fontSize: 16 }}>
              entre dans ton journal substrat
            </p>
          </div>

          {sent && tab === "magic" ? (
            <div className="text-center">
              <div className="card" style={{
                padding: "var(--s-6)",
                background: "color-mix(in oklch, var(--silk-gold) 4%, transparent)",
                borderColor: "var(--silk-gold)",
              }}>
                <div className="meta mb-m" style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--silk-gold)" }}>
                  lien envoyé
                </div>
                <p style={{ fontFamily: "var(--serif)", fontSize: 16, lineHeight: 1.6 }}>
                  ouvre ta boîte mail. clique sur le lien.<br />
                  tu reviendras ici, connecté·e.
                </p>
              </div>
              <button className="btn-text mt-l" onClick={() => { setSent(false); setEmail(""); }} style={{ fontSize: 14 }}>
                renvoyer à un autre email
              </button>
            </div>
          ) : (
            <>
              {/* Tabs */}
              <div style={{
                display: "flex", gap: 4, marginBottom: "var(--s-5)",
                borderBottom: "1px solid var(--ash-deep)",
              }}>
                {[
                  ["signin", "se connecter"],
                  ["signup", "créer un compte"],
                  ["magic", "lien magique"],
                ].map(([k, l]) => (
                  <button key={k}
                    onClick={() => { setTab(k); setError(null); setInfo(null); setSent(false); }}
                    style={{
                      flex: 1,
                      background: "transparent", border: "none", cursor: "pointer",
                      padding: "10px 8px",
                      fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 13,
                      color: tab === k ? "var(--silk-gold)" : "var(--ash-light)",
                      borderBottom: tab === k ? "1px solid var(--silk-gold)" : "1px solid transparent",
                      marginBottom: -1,
                      transition: "all 280ms ease",
                    }}>
                    {l}
                  </button>
                ))}
              </div>

              <input
                type="email"
                placeholder="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(null); }}
                onKeyDown={(e) => { if (e.key === "Enter" && tab === "magic") submit(); }}
                disabled={sending}
                style={inputStyle}
              />

              {tab !== "magic" && (
                <input
                  type="password"
                  placeholder={tab === "signup" ? "mot de passe (6 min.)" : "mot de passe"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(null); }}
                  onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
                  disabled={sending}
                  style={inputStyle}
                />
              )}

              {error && (
                <div className="meta mb-m" style={{ color: "var(--ember-live)", fontFamily: "var(--serif)", fontStyle: "italic", marginTop: 8 }}>
                  {error}
                </div>
              )}
              {info && (
                <div className="meta mb-m" style={{ color: "var(--silk-gold)", fontFamily: "var(--serif)", fontStyle: "italic", marginTop: 8 }}>
                  {info}
                </div>
              )}

              <button
                className="btn-ghost"
                onClick={submit}
                disabled={sending || !email.trim() || (tab !== "magic" && !password)}
                style={{
                  width: "100%",
                  opacity: (sending || !email.trim() || (tab !== "magic" && !password)) ? 0.4 : 1,
                  padding: "14px 16px",
                  marginTop: 12,
                }}>
                {sending ? "…" : tab === "signin" ? "entrer" : tab === "signup" ? "créer" : "envoyer le lien"}
              </button>

              <p className="meta op-70 mt-l text-center" style={{
                fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 12,
                lineHeight: 1.6,
              }}>
                {tab === "signin" && "pas de compte ? bascule sur \"créer un compte\""}
                {tab === "signup" && "ton mot de passe sera ta clé pour revenir"}
                {tab === "magic" && "aucun mot de passe — un lien dans une minute"}
              </p>
            </>
          )}
        </div>
      </div>
    );
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    background: "transparent",
    border: "1px solid var(--ash-deep)",
    color: "var(--bone)",
    fontFamily: "var(--serif)",
    fontSize: 17,
    outline: "none",
    marginBottom: 10,
    boxSizing: "border-box",
  };

  const Loading = () => (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--night-floor)",
    }}>
      <div style={{
        width: 32, height: 32,
        borderRadius: "50%",
        border: "1px solid var(--ash-mid)",
        animation: "halo-slow 3s ease-in-out infinite",
      }} />
    </div>
  );

  const AuthGate = ({ children }) => {
    const [status, setStatus] = uAS("loading"); // loading | signed_in | signed_out
    const [user, setUser] = uAS(null);

    uAE(() => {
      let cancelled = false;
      let initialResolved = false;

      // No-auth mode (no Supabase loaded OR ?demo=1) → bypass gate
      if (window.DreamAuth?.noAuth) {
        console.log("[AuthGate] no-auth mode → bypass gate");
        setUser({ id: "demo-user", email: "demo@infuse.earth" });
        setStatus("signed_in");
        return;
      }

      // Initial session check (source of truth for first paint)
      window.DreamAuth.getSession().then((session) => {
        if (cancelled) return;
        initialResolved = true;
        console.log("[AuthGate] initial getSession →", session?.user?.email || "no session");
        if (session?.user) {
          setUser(session.user);
          setStatus("signed_in");
        } else {
          setStatus("signed_out");
        }
      });

      // Listen for EXPLICIT auth events ONLY.
      // Ignore INITIAL_SESSION (handled by getSession above) and TOKEN_REFRESHED
      // (transparent — user stays signed in).
      const unsub = window.DreamAuth.onAuthChange((event, session) => {
        if (cancelled) return;
        console.log("[AuthGate] event:", event, "user:", session?.user?.email || "none", "initialResolved:", initialResolved);

        // Defensive : ignore ANY event before getSession resolves to avoid race
        if (!initialResolved) {
          console.log("[AuthGate] ignoring event (initial not resolved yet)");
          return;
        }

        if (event === "INITIAL_SESSION") return;
        if (event === "TOKEN_REFRESHED") {
          if (session?.user) setUser(session.user);
          return;
        }
        if (event === "SIGNED_IN" && session?.user) {
          setUser(session.user);
          setStatus("signed_in");
        } else if (event === "SIGNED_OUT" || event === "USER_DELETED") {
          console.log("[AuthGate] explicit SIGNED_OUT → flipping to signed_out");
          setUser(null);
          setStatus("signed_out");
        } else if (event === "USER_UPDATED" && session?.user) {
          setUser(session.user);
        }
      });

      return () => { cancelled = true; unsub(); };
    }, []);

    // Expose user globally for screens (debug, feedback, etc.)
    uAE(() => {
      window.DreamUser = user;
    }, [user]);

    if (status === "loading") return <Loading />;
    if (status === "signed_out") return <SignInScreen onSignIn={() => setStatus("loading")} />;
    return children;
  };

  window.AuthGate = AuthGate;
  window.SignInScreen = SignInScreen;
})();
