(function setupDreamAuth() {
  var _a;
  const SUPABASE_URL = window.SUPABASE_URL || "https://rtrkxzcyblgonwgfzovj.supabase.co";
  const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || "";
  const isDemoMode = (() => {
    try {
      return new URL(location.href).searchParams.get("demo") === "1";
    } catch (e) {
      return false;
    }
  })();
  if (isDemoMode || !((_a = window.supabase) == null ? void 0 : _a.createClient) || !SUPABASE_ANON_KEY) {
    const reason = isDemoMode ? "demo mode (?demo=1)" : !window.supabase ? "supabase-js UMD not loaded" : "SUPABASE_ANON_KEY missing";
    console.warn("[DreamAuth] " + reason + " \u2014 bypass AuthGate, seed-only mode");
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
      signOut: async () => {
      },
      onAuthChange: () => () => {
      }
    };
    return;
  }
  const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: "dream-app-supabase-auth",
      flowType: "implicit"
      // magic link returns access_token in hash (not PKCE which needs code)
    }
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
      return (data == null ? void 0 : data.session) || null;
    },
    async getAccessToken() {
      const session = await this.getSession();
      return (session == null ? void 0 : session.access_token) || null;
    },
    async getUser() {
      const session = await this.getSession();
      return (session == null ? void 0 : session.user) || null;
    },
    async signInPassword(email, password) {
      const cleanEmail = (email || "").trim().toLowerCase();
      if (!cleanEmail || !password) return { error: "email + password requis" };
      const { data, error } = await client.auth.signInWithPassword({
        email: cleanEmail,
        password
      });
      if (error) return { error: error.message };
      return { ok: true, user: data == null ? void 0 : data.user };
    },
    async signUpPassword(email, password) {
      const cleanEmail = (email || "").trim().toLowerCase();
      if (!cleanEmail || !password) return { error: "email + password requis" };
      if (password.length < 6) return { error: "mot de passe : 6 caract\xE8res minimum" };
      const { data, error } = await client.auth.signUp({
        email: cleanEmail,
        password,
        options: { emailRedirectTo: window.location.origin + "/v12/index.html" }
      });
      if (error) return { error: error.message };
      const needsConfirm = !(data == null ? void 0 : data.session);
      return { ok: true, user: data == null ? void 0 : data.user, needsConfirm };
    },
    async signInMagicLink(email) {
      const cleanEmail = (email || "").trim().toLowerCase();
      if (!cleanEmail) return { error: "email requis" };
      const redirectTo = window.location.origin + "/v12/index.html";
      const { error } = await client.auth.signInWithOtp({
        email: cleanEmail,
        options: { emailRedirectTo: redirectTo }
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
        try {
          cb(event, session);
        } catch (e) {
          console.error("[DreamAuth] onAuthChange cb error:", e);
        }
      });
      return () => {
        var _a2, _b;
        return (_b = (_a2 = data == null ? void 0 : data.subscription) == null ? void 0 : _a2.unsubscribe) == null ? void 0 : _b.call(_a2);
      };
    }
  };
  window.DreamAuth.onAuthChange((event) => {
    if (event === "SIGNED_IN" && window.location.hash.includes("access_token")) {
      console.log("[DreamAuth] cleaning access_token from URL");
      try {
        history.replaceState(null, "", window.location.pathname);
      } catch (e) {
      }
    }
  });
})();
(function setupAuthGate() {
  const { useState: uAS, useEffect: uAE } = React;
  const SignInScreen = ({ onSignIn }) => {
    const [tab, setTab] = uAS("signin");
    const [email, setEmail] = uAS("");
    const [password, setPassword] = uAS("");
    const [sending, setSending] = uAS(false);
    const [sent, setSent] = uAS(false);
    const [error, setError] = uAS(null);
    const [info, setInfo] = uAS(null);
    const submit = async () => {
      if (!email.trim() || !email.includes("@")) {
        setError("email valide requis");
        return;
      }
      setSending(true);
      setError(null);
      setInfo(null);
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
        setInfo("compte cr\xE9\xE9. v\xE9rifie ton email pour confirmer.");
      } else {
        if (onSignIn) onSignIn();
      }
    };
    return /* @__PURE__ */ React.createElement("div", { className: "stage screen-enter", style: {
      background: "var(--night-floor)",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "var(--s-5)"
    } }, /* @__PURE__ */ React.createElement("div", { className: "frame", style: { maxWidth: 440, width: "100%" } }, /* @__PURE__ */ React.createElement("div", { className: "text-center", style: { marginBottom: "var(--s-7)" } }, /* @__PURE__ */ React.createElement("div", { style: {
      width: 48,
      height: 48,
      margin: "0 auto var(--s-4)",
      borderRadius: "50%",
      border: "1px solid var(--ash-mid)",
      animation: "halo-slow 4s ease-in-out infinite"
    } }), /* @__PURE__ */ React.createElement("h1", { className: "h1-seuil", style: { fontSize: 32 } }, "Dream"), /* @__PURE__ */ React.createElement("p", { className: "seuil-italic mt-s", style: { color: "var(--ash-light)", fontSize: 16 } }, "entre dans ton journal substrat")), sent && tab === "magic" ? /* @__PURE__ */ React.createElement("div", { className: "text-center" }, /* @__PURE__ */ React.createElement("div", { className: "card", style: {
      padding: "var(--s-6)",
      background: "color-mix(in oklch, var(--silk-gold) 4%, transparent)",
      borderColor: "var(--silk-gold)"
    } }, /* @__PURE__ */ React.createElement("div", { className: "meta mb-m", style: { fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--silk-gold)" } }, "lien envoy\xE9"), /* @__PURE__ */ React.createElement("p", { style: { fontFamily: "var(--serif)", fontSize: 16, lineHeight: 1.6 } }, "ouvre ta bo\xEEte mail. clique sur le lien.", /* @__PURE__ */ React.createElement("br", null), "tu reviendras ici, connect\xE9\xB7e.")), /* @__PURE__ */ React.createElement("button", { className: "btn-text mt-l", onClick: () => {
      setSent(false);
      setEmail("");
    }, style: { fontSize: 14 } }, "renvoyer \xE0 un autre email")) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: {
      display: "flex",
      gap: 4,
      marginBottom: "var(--s-5)",
      borderBottom: "1px solid var(--ash-deep)"
    } }, [
      ["signin", "se connecter"],
      ["signup", "cr\xE9er un compte"],
      ["magic", "lien magique"]
    ].map(([k, l]) => /* @__PURE__ */ React.createElement(
      "button",
      {
        key: k,
        onClick: () => {
          setTab(k);
          setError(null);
          setInfo(null);
          setSent(false);
        },
        style: {
          flex: 1,
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: "10px 8px",
          fontFamily: "var(--serif)",
          fontStyle: "italic",
          fontSize: 13,
          color: tab === k ? "var(--silk-gold)" : "var(--ash-light)",
          borderBottom: tab === k ? "1px solid var(--silk-gold)" : "1px solid transparent",
          marginBottom: -1,
          transition: "all 280ms ease"
        }
      },
      l
    ))), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "email",
        placeholder: "email",
        value: email,
        onChange: (e) => {
          setEmail(e.target.value);
          setError(null);
        },
        onKeyDown: (e) => {
          if (e.key === "Enter" && tab === "magic") submit();
        },
        disabled: sending,
        style: inputStyle
      }
    ), tab !== "magic" && /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "password",
        placeholder: tab === "signup" ? "mot de passe (6 min.)" : "mot de passe",
        value: password,
        onChange: (e) => {
          setPassword(e.target.value);
          setError(null);
        },
        onKeyDown: (e) => {
          if (e.key === "Enter") submit();
        },
        disabled: sending,
        style: inputStyle
      }
    ), error && /* @__PURE__ */ React.createElement("div", { className: "meta mb-m", style: { color: "var(--ember-live)", fontFamily: "var(--serif)", fontStyle: "italic", marginTop: 8 } }, error), info && /* @__PURE__ */ React.createElement("div", { className: "meta mb-m", style: { color: "var(--silk-gold)", fontFamily: "var(--serif)", fontStyle: "italic", marginTop: 8 } }, info), /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "btn-ghost",
        onClick: submit,
        disabled: sending || !email.trim() || tab !== "magic" && !password,
        style: {
          width: "100%",
          opacity: sending || !email.trim() || tab !== "magic" && !password ? 0.4 : 1,
          padding: "14px 16px",
          marginTop: 12
        }
      },
      sending ? "\u2026" : tab === "signin" ? "entrer" : tab === "signup" ? "cr\xE9er" : "envoyer le lien"
    ), /* @__PURE__ */ React.createElement("p", { className: "meta op-70 mt-l text-center", style: {
      fontFamily: "var(--serif)",
      fontStyle: "italic",
      fontSize: 12,
      lineHeight: 1.6
    } }, tab === "signin" && 'pas de compte ? bascule sur "cr\xE9er un compte"', tab === "signup" && "ton mot de passe sera ta cl\xE9 pour revenir", tab === "magic" && "aucun mot de passe \u2014 un lien dans une minute"))));
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
    boxSizing: "border-box"
  };
  const Loading = () => /* @__PURE__ */ React.createElement("div", { style: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "var(--night-floor)"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    border: "1px solid var(--ash-mid)",
    animation: "halo-slow 3s ease-in-out infinite"
  } }));
  const AuthGate = ({ children }) => {
    const [status, setStatus] = uAS("loading");
    const [user, setUser] = uAS(null);
    uAE(() => {
      var _a;
      let cancelled = false;
      let initialResolved = false;
      if ((_a = window.DreamAuth) == null ? void 0 : _a.noAuth) {
        console.log("[AuthGate] no-auth mode \u2192 bypass gate");
        setUser({ id: "demo-user", email: "demo@infuse.earth" });
        setStatus("signed_in");
        return;
      }
      window.DreamAuth.getSession().then((session) => {
        var _a2;
        if (cancelled) return;
        initialResolved = true;
        console.log("[AuthGate] initial getSession \u2192", ((_a2 = session == null ? void 0 : session.user) == null ? void 0 : _a2.email) || "no session");
        if (session == null ? void 0 : session.user) {
          setUser(session.user);
          setStatus("signed_in");
        } else {
          setStatus("signed_out");
        }
      });
      const unsub = window.DreamAuth.onAuthChange((event, session) => {
        var _a2;
        if (cancelled) return;
        console.log("[AuthGate] event:", event, "user:", ((_a2 = session == null ? void 0 : session.user) == null ? void 0 : _a2.email) || "none", "initialResolved:", initialResolved);
        if (!initialResolved) {
          console.log("[AuthGate] ignoring event (initial not resolved yet)");
          return;
        }
        if (event === "INITIAL_SESSION") return;
        if (event === "TOKEN_REFRESHED") {
          if (session == null ? void 0 : session.user) setUser(session.user);
          return;
        }
        if (event === "SIGNED_IN" && (session == null ? void 0 : session.user)) {
          setUser(session.user);
          setStatus("signed_in");
        } else if (event === "SIGNED_OUT" || event === "USER_DELETED") {
          console.log("[AuthGate] explicit SIGNED_OUT \u2192 flipping to signed_out");
          setUser(null);
          setStatus("signed_out");
        } else if (event === "USER_UPDATED" && (session == null ? void 0 : session.user)) {
          setUser(session.user);
        }
      });
      return () => {
        cancelled = true;
        unsub();
      };
    }, []);
    uAE(() => {
      window.DreamUser = user;
    }, [user]);
    if (status === "loading") return /* @__PURE__ */ React.createElement(Loading, null);
    if (status === "signed_out") return /* @__PURE__ */ React.createElement(SignInScreen, { onSignIn: () => setStatus("loading") });
    return children;
  };
  window.AuthGate = AuthGate;
  window.SignInScreen = SignInScreen;
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiYXV0aC5qc3giXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8qIGdsb2JhbCBSZWFjdCwgc3VwYWJhc2UgKi9cbi8vIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy8gRHJlYW0gVjEuMiBcdTIwMTQgU3VwYWJhc2UgYXV0aCBicmlkZ2UgKGlmcmFtZSBcdTIxOTIgTmV4dC5qcyBCZWFyZXIpXG4vLyAyMDI2LTA0LTI1IFx1MjAxNCBZZXNodWEgIChyZXYgMiA6IHBhc3N3b3JkICsgbWFnaWMgbGluayArIGRlbW8gbW9kZSArIGRlYnVnKVxuLy9cbi8vIE1vZGVzIDpcbi8vICAgLSBwYXNzd29yZCAoZGVmYXVsdCkgOiBlbWFpbCArIHBhc3N3b3JkIHNpZ24gaW4gLyBzaWduIHVwXG4vLyAgIC0gbWFnaWMgbGluayAoYmFja3VwKSA6IE9UUCBlbWFpbCBsaW5rXG4vLyAgIC0gZGVtbyAoP2RlbW89MSkgICAgOiBieXBhc3MgQXV0aEdhdGUsIGZha2UgdXNlciwgc2VlZCBkYXRhIG9ubHlcbi8vXG4vLyBFbnYgdmFycyA6IHdpbmRvdy5TVVBBQkFTRV9VUkwgKyB3aW5kb3cuU1VQQUJBU0VfQU5PTl9LRVkgKHNldCBpbmxpbmUgZGFuc1xuLy8gaW5kZXguaHRtbCB2aWEgL2FwaS92MTItZW52KS4gU2kgYWJzZW50ZXMgXHUyMTkyIG1vZGUgZGVtbyBzaWxlbmNpZXV4LlxuLy8gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbihmdW5jdGlvbiBzZXR1cERyZWFtQXV0aCgpIHtcbiAgY29uc3QgU1VQQUJBU0VfVVJMID0gd2luZG93LlNVUEFCQVNFX1VSTCB8fCBcImh0dHBzOi8vcnRya3h6Y3libGdvbndnZnpvdmouc3VwYWJhc2UuY29cIjtcbiAgY29uc3QgU1VQQUJBU0VfQU5PTl9LRVkgPSB3aW5kb3cuU1VQQUJBU0VfQU5PTl9LRVkgfHwgXCJcIjtcblxuICBjb25zdCBpc0RlbW9Nb2RlID0gKCgpID0+IHtcbiAgICB0cnkgeyByZXR1cm4gbmV3IFVSTChsb2NhdGlvbi5ocmVmKS5zZWFyY2hQYXJhbXMuZ2V0KFwiZGVtb1wiKSA9PT0gXCIxXCI7IH1cbiAgICBjYXRjaCB7IHJldHVybiBmYWxzZTsgfVxuICB9KSgpO1xuXG4gIC8vIE5vLWF1dGggbW9kZSBpZiA6ID9kZW1vPTEgT1Igbm8gc3VwYWJhc2UgSlMgT1Igbm8gYW5vbiBrZXlcbiAgaWYgKGlzRGVtb01vZGUgfHwgIXdpbmRvdy5zdXBhYmFzZT8uY3JlYXRlQ2xpZW50IHx8ICFTVVBBQkFTRV9BTk9OX0tFWSkge1xuICAgIGNvbnN0IHJlYXNvbiA9IGlzRGVtb01vZGUgPyBcImRlbW8gbW9kZSAoP2RlbW89MSlcIlxuICAgICAgOiAhd2luZG93LnN1cGFiYXNlID8gXCJzdXBhYmFzZS1qcyBVTUQgbm90IGxvYWRlZFwiXG4gICAgICA6IFwiU1VQQUJBU0VfQU5PTl9LRVkgbWlzc2luZ1wiO1xuICAgIGNvbnNvbGUud2FybihcIltEcmVhbUF1dGhdIFwiICsgcmVhc29uICsgXCIgXHUyMDE0IGJ5cGFzcyBBdXRoR2F0ZSwgc2VlZC1vbmx5IG1vZGVcIik7XG4gICAgd2luZG93LkRyZWFtQXV0aCA9IHtcbiAgICAgIHJlYWR5OiBmYWxzZSxcbiAgICAgIG5vQXV0aDogdHJ1ZSxcbiAgICAgIG1vZGU6IFwiZGVtb1wiLFxuICAgICAgZ2V0U2Vzc2lvbjogYXN5bmMgKCkgPT4gbnVsbCxcbiAgICAgIGdldEFjY2Vzc1Rva2VuOiBhc3luYyAoKSA9PiBudWxsLFxuICAgICAgZ2V0VXNlcjogYXN5bmMgKCkgPT4gKHsgaWQ6IFwiZGVtby11c2VyXCIsIGVtYWlsOiBcImRlbW9AaW5mdXNlLmVhcnRoXCIgfSksXG4gICAgICBzaWduSW5QYXNzd29yZDogYXN5bmMgKCkgPT4gKHsgZXJyb3I6IFwiYXV0aCBkaXNhYmxlZFwiIH0pLFxuICAgICAgc2lnblVwUGFzc3dvcmQ6IGFzeW5jICgpID0+ICh7IGVycm9yOiBcImF1dGggZGlzYWJsZWRcIiB9KSxcbiAgICAgIHNpZ25Jbk1hZ2ljTGluazogYXN5bmMgKCkgPT4gKHsgZXJyb3I6IFwiYXV0aCBkaXNhYmxlZFwiIH0pLFxuICAgICAgc2lnbk91dDogYXN5bmMgKCkgPT4ge30sXG4gICAgICBvbkF1dGhDaGFuZ2U6ICgpID0+ICgpID0+IHt9LFxuICAgIH07XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gZGV0ZWN0U2Vzc2lvbkluVXJsOiB0cnVlIGlzIG5lY2Vzc2FyeSBmb3IgbWFnaWMgbGluayBmbG93LlxuICAvLyBCVVQgaWZyYW1lIHNhbmRib3hlcyBjYW4gY29uZnVzZSBpdCBcdTIwMTQgd2Uga2VlcCBpdCBvbiBidXQgYWxzbyBtYW51YWxseVxuICAvLyBwcm9jZXNzIGhhc2ggb24gaW5pdCBpbiBjYXNlIGl0J3MgbWlzc2VkLlxuICBjb25zdCBjbGllbnQgPSB3aW5kb3cuc3VwYWJhc2UuY3JlYXRlQ2xpZW50KFNVUEFCQVNFX1VSTCwgU1VQQUJBU0VfQU5PTl9LRVksIHtcbiAgICBhdXRoOiB7XG4gICAgICBwZXJzaXN0U2Vzc2lvbjogdHJ1ZSxcbiAgICAgIGF1dG9SZWZyZXNoVG9rZW46IHRydWUsXG4gICAgICBkZXRlY3RTZXNzaW9uSW5Vcmw6IHRydWUsXG4gICAgICBzdG9yYWdlS2V5OiBcImRyZWFtLWFwcC1zdXBhYmFzZS1hdXRoXCIsXG4gICAgICBmbG93VHlwZTogXCJpbXBsaWNpdFwiLCAvLyBtYWdpYyBsaW5rIHJldHVybnMgYWNjZXNzX3Rva2VuIGluIGhhc2ggKG5vdCBQS0NFIHdoaWNoIG5lZWRzIGNvZGUpXG4gICAgfSxcbiAgfSk7XG5cbiAgd2luZG93LkRyZWFtU3VwYWJhc2UgPSBjbGllbnQ7XG5cbiAgd2luZG93LkRyZWFtQXV0aCA9IHtcbiAgICByZWFkeTogdHJ1ZSxcbiAgICBub0F1dGg6IGZhbHNlLFxuICAgIG1vZGU6IFwic3VwYWJhc2VcIixcbiAgICBjbGllbnQsXG5cbiAgICBhc3luYyBnZXRTZXNzaW9uKCkge1xuICAgICAgY29uc3QgeyBkYXRhLCBlcnJvciB9ID0gYXdhaXQgY2xpZW50LmF1dGguZ2V0U2Vzc2lvbigpO1xuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihcIltEcmVhbUF1dGhdIGdldFNlc3Npb24gZXJyb3I6XCIsIGVycm9yLm1lc3NhZ2UpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBkYXRhPy5zZXNzaW9uIHx8IG51bGw7XG4gICAgfSxcblxuICAgIGFzeW5jIGdldEFjY2Vzc1Rva2VuKCkge1xuICAgICAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IHRoaXMuZ2V0U2Vzc2lvbigpO1xuICAgICAgcmV0dXJuIHNlc3Npb24/LmFjY2Vzc190b2tlbiB8fCBudWxsO1xuICAgIH0sXG5cbiAgICBhc3luYyBnZXRVc2VyKCkge1xuICAgICAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IHRoaXMuZ2V0U2Vzc2lvbigpO1xuICAgICAgcmV0dXJuIHNlc3Npb24/LnVzZXIgfHwgbnVsbDtcbiAgICB9LFxuXG4gICAgYXN5bmMgc2lnbkluUGFzc3dvcmQoZW1haWwsIHBhc3N3b3JkKSB7XG4gICAgICBjb25zdCBjbGVhbkVtYWlsID0gKGVtYWlsIHx8IFwiXCIpLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgaWYgKCFjbGVhbkVtYWlsIHx8ICFwYXNzd29yZCkgcmV0dXJuIHsgZXJyb3I6IFwiZW1haWwgKyBwYXNzd29yZCByZXF1aXNcIiB9O1xuICAgICAgY29uc3QgeyBkYXRhLCBlcnJvciB9ID0gYXdhaXQgY2xpZW50LmF1dGguc2lnbkluV2l0aFBhc3N3b3JkKHtcbiAgICAgICAgZW1haWw6IGNsZWFuRW1haWwsIHBhc3N3b3JkLFxuICAgICAgfSk7XG4gICAgICBpZiAoZXJyb3IpIHJldHVybiB7IGVycm9yOiBlcnJvci5tZXNzYWdlIH07XG4gICAgICByZXR1cm4geyBvazogdHJ1ZSwgdXNlcjogZGF0YT8udXNlciB9O1xuICAgIH0sXG5cbiAgICBhc3luYyBzaWduVXBQYXNzd29yZChlbWFpbCwgcGFzc3dvcmQpIHtcbiAgICAgIGNvbnN0IGNsZWFuRW1haWwgPSAoZW1haWwgfHwgXCJcIikudHJpbSgpLnRvTG93ZXJDYXNlKCk7XG4gICAgICBpZiAoIWNsZWFuRW1haWwgfHwgIXBhc3N3b3JkKSByZXR1cm4geyBlcnJvcjogXCJlbWFpbCArIHBhc3N3b3JkIHJlcXVpc1wiIH07XG4gICAgICBpZiAocGFzc3dvcmQubGVuZ3RoIDwgNikgcmV0dXJuIHsgZXJyb3I6IFwibW90IGRlIHBhc3NlIDogNiBjYXJhY3RcdTAwRThyZXMgbWluaW11bVwiIH07XG4gICAgICBjb25zdCB7IGRhdGEsIGVycm9yIH0gPSBhd2FpdCBjbGllbnQuYXV0aC5zaWduVXAoe1xuICAgICAgICBlbWFpbDogY2xlYW5FbWFpbCwgcGFzc3dvcmQsXG4gICAgICAgIG9wdGlvbnM6IHsgZW1haWxSZWRpcmVjdFRvOiB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgXCIvdjEyL2luZGV4Lmh0bWxcIiB9LFxuICAgICAgfSk7XG4gICAgICBpZiAoZXJyb3IpIHJldHVybiB7IGVycm9yOiBlcnJvci5tZXNzYWdlIH07XG4gICAgICAvLyBJZiBlbWFpbCBjb25maXJtYXRpb24gZW5hYmxlZCBpbiBTdXBhYmFzZSwgdXNlci5zZXNzaW9uIGlzIG51bGwuXG4gICAgICAvLyBJZiBkaXNhYmxlZCAocmVjb21tZW5kZWQgZm9yIGxvdy1mcmljdGlvbiksIHVzZXIgaXMgc2lnbmVkIGluIGltbWVkaWF0ZWx5LlxuICAgICAgY29uc3QgbmVlZHNDb25maXJtID0gIWRhdGE/LnNlc3Npb247XG4gICAgICByZXR1cm4geyBvazogdHJ1ZSwgdXNlcjogZGF0YT8udXNlciwgbmVlZHNDb25maXJtIH07XG4gICAgfSxcblxuICAgIGFzeW5jIHNpZ25Jbk1hZ2ljTGluayhlbWFpbCkge1xuICAgICAgY29uc3QgY2xlYW5FbWFpbCA9IChlbWFpbCB8fCBcIlwiKS50cmltKCkudG9Mb3dlckNhc2UoKTtcbiAgICAgIGlmICghY2xlYW5FbWFpbCkgcmV0dXJuIHsgZXJyb3I6IFwiZW1haWwgcmVxdWlzXCIgfTtcbiAgICAgIGNvbnN0IHJlZGlyZWN0VG8gPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgXCIvdjEyL2luZGV4Lmh0bWxcIjtcbiAgICAgIGNvbnN0IHsgZXJyb3IgfSA9IGF3YWl0IGNsaWVudC5hdXRoLnNpZ25JbldpdGhPdHAoe1xuICAgICAgICBlbWFpbDogY2xlYW5FbWFpbCxcbiAgICAgICAgb3B0aW9uczogeyBlbWFpbFJlZGlyZWN0VG86IHJlZGlyZWN0VG8gfSxcbiAgICAgIH0pO1xuICAgICAgaWYgKGVycm9yKSByZXR1cm4geyBlcnJvcjogZXJyb3IubWVzc2FnZSB9O1xuICAgICAgcmV0dXJuIHsgb2s6IHRydWUgfTtcbiAgICB9LFxuXG4gICAgYXN5bmMgc2lnbk91dCgpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiW0RyZWFtQXV0aF0gZXhwbGljaXQgc2lnbk91dCBjYWxsZWRcIik7XG4gICAgICBhd2FpdCBjbGllbnQuYXV0aC5zaWduT3V0KCk7XG4gICAgfSxcblxuICAgIG9uQXV0aENoYW5nZShjYikge1xuICAgICAgY29uc3QgeyBkYXRhIH0gPSBjbGllbnQuYXV0aC5vbkF1dGhTdGF0ZUNoYW5nZSgoZXZlbnQsIHNlc3Npb24pID0+IHtcbiAgICAgICAgdHJ5IHsgY2IoZXZlbnQsIHNlc3Npb24pOyB9IGNhdGNoIChlKSB7IGNvbnNvbGUuZXJyb3IoXCJbRHJlYW1BdXRoXSBvbkF1dGhDaGFuZ2UgY2IgZXJyb3I6XCIsIGUpOyB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiAoKSA9PiBkYXRhPy5zdWJzY3JpcHRpb24/LnVuc3Vic2NyaWJlPy4oKTtcbiAgICB9LFxuICB9O1xuXG4gIC8vIENsZWFuIG1hZ2ljLWxpbmsgaGFzaCBmcm9tIFVSTCBvbmNlIGF1dGggcGlja2VkIGl0IHVwXG4gIHdpbmRvdy5EcmVhbUF1dGgub25BdXRoQ2hhbmdlKChldmVudCkgPT4ge1xuICAgIGlmIChldmVudCA9PT0gXCJTSUdORURfSU5cIiAmJiB3aW5kb3cubG9jYXRpb24uaGFzaC5pbmNsdWRlcyhcImFjY2Vzc190b2tlblwiKSkge1xuICAgICAgY29uc29sZS5sb2coXCJbRHJlYW1BdXRoXSBjbGVhbmluZyBhY2Nlc3NfdG9rZW4gZnJvbSBVUkxcIik7XG4gICAgICB0cnkge1xuICAgICAgICBoaXN0b3J5LnJlcGxhY2VTdGF0ZShudWxsLCBcIlwiLCB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUpO1xuICAgICAgfSBjYXRjaCB7fVxuICAgIH1cbiAgfSk7XG59KSgpO1xuXG4vLyBcdTI1MDBcdTI1MDAgQXV0aEdhdGUgUmVhY3QgY29tcG9uZW50IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy8gV3JhcHMgdGhlIGFwcC4gV2hpbGUgc2Vzc2lvbiBsb2FkaW5nIFx1MjE5MiBzb2Z0IGhhbG8uIE5vIHNlc3Npb24gXHUyMTkyIFNpZ25Jbi5cbi8vIFNlc3Npb24gcHJlc2VudCBcdTIxOTIgcmVuZGVycyBjaGlsZHJlbi5cbi8vIENSSVRJQ0FMIDogd2UgSUdOT1JFIElOSVRJQUxfU0VTU0lPTiArIFRPS0VOX1JFRlJFU0hFRCBldmVudHMgdG8gYXZvaWRcbi8vIHJhY2UgY29uZGl0aW9ucyB3aGVyZSB0aGUgbGlzdGVuZXIgZmxpcHMgc3RhdHVzIGJhY2sgdG8gc2lnbmVkX291dFxuLy8gd2hpbGUgZ2V0U2Vzc2lvbigpIGhhcyBhbHJlYWR5IHJldHVybmVkIGEgdmFsaWQgc2Vzc2lvbi5cblxuKGZ1bmN0aW9uIHNldHVwQXV0aEdhdGUoKSB7XG4gIGNvbnN0IHsgdXNlU3RhdGU6IHVBUywgdXNlRWZmZWN0OiB1QUUgfSA9IFJlYWN0O1xuXG4gIGNvbnN0IFNpZ25JblNjcmVlbiA9ICh7IG9uU2lnbkluIH0pID0+IHtcbiAgICBjb25zdCBbdGFiLCBzZXRUYWJdID0gdUFTKFwic2lnbmluXCIpOyAvLyBzaWduaW4gfCBzaWdudXAgfCBtYWdpY1xuICAgIGNvbnN0IFtlbWFpbCwgc2V0RW1haWxdID0gdUFTKFwiXCIpO1xuICAgIGNvbnN0IFtwYXNzd29yZCwgc2V0UGFzc3dvcmRdID0gdUFTKFwiXCIpO1xuICAgIGNvbnN0IFtzZW5kaW5nLCBzZXRTZW5kaW5nXSA9IHVBUyhmYWxzZSk7XG4gICAgY29uc3QgW3NlbnQsIHNldFNlbnRdID0gdUFTKGZhbHNlKTtcbiAgICBjb25zdCBbZXJyb3IsIHNldEVycm9yXSA9IHVBUyhudWxsKTtcbiAgICBjb25zdCBbaW5mbywgc2V0SW5mb10gPSB1QVMobnVsbCk7XG5cbiAgICBjb25zdCBzdWJtaXQgPSBhc3luYyAoKSA9PiB7XG4gICAgICBpZiAoIWVtYWlsLnRyaW0oKSB8fCAhZW1haWwuaW5jbHVkZXMoXCJAXCIpKSB7XG4gICAgICAgIHNldEVycm9yKFwiZW1haWwgdmFsaWRlIHJlcXVpc1wiKTsgcmV0dXJuO1xuICAgICAgfVxuICAgICAgc2V0U2VuZGluZyh0cnVlKTsgc2V0RXJyb3IobnVsbCk7IHNldEluZm8obnVsbCk7XG4gICAgICBsZXQgcmVzdWx0O1xuICAgICAgaWYgKHRhYiA9PT0gXCJzaWduaW5cIikge1xuICAgICAgICByZXN1bHQgPSBhd2FpdCB3aW5kb3cuRHJlYW1BdXRoLnNpZ25JblBhc3N3b3JkKGVtYWlsLCBwYXNzd29yZCk7XG4gICAgICB9IGVsc2UgaWYgKHRhYiA9PT0gXCJzaWdudXBcIikge1xuICAgICAgICByZXN1bHQgPSBhd2FpdCB3aW5kb3cuRHJlYW1BdXRoLnNpZ25VcFBhc3N3b3JkKGVtYWlsLCBwYXNzd29yZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHQgPSBhd2FpdCB3aW5kb3cuRHJlYW1BdXRoLnNpZ25Jbk1hZ2ljTGluayhlbWFpbCk7XG4gICAgICB9XG4gICAgICBzZXRTZW5kaW5nKGZhbHNlKTtcbiAgICAgIGlmIChyZXN1bHQuZXJyb3IpIHtcbiAgICAgICAgc2V0RXJyb3IocmVzdWx0LmVycm9yKTtcbiAgICAgIH0gZWxzZSBpZiAodGFiID09PSBcIm1hZ2ljXCIpIHtcbiAgICAgICAgc2V0U2VudCh0cnVlKTtcbiAgICAgIH0gZWxzZSBpZiAodGFiID09PSBcInNpZ251cFwiICYmIHJlc3VsdC5uZWVkc0NvbmZpcm0pIHtcbiAgICAgICAgc2V0SW5mbyhcImNvbXB0ZSBjclx1MDBFOVx1MDBFOS4gdlx1MDBFOXJpZmllIHRvbiBlbWFpbCBwb3VyIGNvbmZpcm1lci5cIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBzaWduaW4gc3VjY2VzcyBvciBzaWdudXAgYXV0by1jb25maXJtZWQgXHUyMTkyIG9uQXV0aENoYW5nZSB3aWxsIHRyaWdnZXIgQXV0aEdhdGVcbiAgICAgICAgaWYgKG9uU2lnbkluKSBvblNpZ25JbigpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJzdGFnZSBzY3JlZW4tZW50ZXJcIiBzdHlsZT17e1xuICAgICAgICBiYWNrZ3JvdW5kOiBcInZhcigtLW5pZ2h0LWZsb29yKVwiLFxuICAgICAgICBtaW5IZWlnaHQ6IFwiMTAwdmhcIixcbiAgICAgICAgZGlzcGxheTogXCJmbGV4XCIsXG4gICAgICAgIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXG4gICAgICAgIGp1c3RpZnlDb250ZW50OiBcImNlbnRlclwiLFxuICAgICAgICBwYWRkaW5nOiBcInZhcigtLXMtNSlcIixcbiAgICAgIH19PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZyYW1lXCIgc3R5bGU9e3sgbWF4V2lkdGg6IDQ0MCwgd2lkdGg6IFwiMTAwJVwiIH19PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1jZW50ZXJcIiBzdHlsZT17eyBtYXJnaW5Cb3R0b206IFwidmFyKC0tcy03KVwiIH19PlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgICB3aWR0aDogNDgsIGhlaWdodDogNDgsIG1hcmdpbjogXCIwIGF1dG8gdmFyKC0tcy00KVwiLFxuICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IFwiNTAlXCIsXG4gICAgICAgICAgICAgIGJvcmRlcjogXCIxcHggc29saWQgdmFyKC0tYXNoLW1pZClcIixcbiAgICAgICAgICAgICAgYW5pbWF0aW9uOiBcImhhbG8tc2xvdyA0cyBlYXNlLWluLW91dCBpbmZpbml0ZVwiLFxuICAgICAgICAgICAgfX0gLz5cbiAgICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJoMS1zZXVpbFwiIHN0eWxlPXt7IGZvbnRTaXplOiAzMiB9fT5EcmVhbTwvaDE+XG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJzZXVpbC1pdGFsaWMgbXQtc1wiIHN0eWxlPXt7IGNvbG9yOiBcInZhcigtLWFzaC1saWdodClcIiwgZm9udFNpemU6IDE2IH19PlxuICAgICAgICAgICAgICBlbnRyZSBkYW5zIHRvbiBqb3VybmFsIHN1YnN0cmF0XG4gICAgICAgICAgICA8L3A+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICB7c2VudCAmJiB0YWIgPT09IFwibWFnaWNcIiA/IChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1jZW50ZXJcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkXCIgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBwYWRkaW5nOiBcInZhcigtLXMtNilcIixcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBcImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSA0JSwgdHJhbnNwYXJlbnQpXCIsXG4gICAgICAgICAgICAgICAgYm9yZGVyQ29sb3I6IFwidmFyKC0tc2lsay1nb2xkKVwiLFxuICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1ldGEgbWItbVwiIHN0eWxlPXt7IGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgY29sb3I6IFwidmFyKC0tc2lsay1nb2xkKVwiIH19PlxuICAgICAgICAgICAgICAgICAgbGllbiBlbnZveVx1MDBFOVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxwIHN0eWxlPXt7IGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTaXplOiAxNiwgbGluZUhlaWdodDogMS42IH19PlxuICAgICAgICAgICAgICAgICAgb3V2cmUgdGEgYm9cdTAwRUV0ZSBtYWlsLiBjbGlxdWUgc3VyIGxlIGxpZW4uPGJyIC8+XG4gICAgICAgICAgICAgICAgICB0dSByZXZpZW5kcmFzIGljaSwgY29ubmVjdFx1MDBFOVx1MDBCN2UuXG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4tdGV4dCBtdC1sXCIgb25DbGljaz17KCkgPT4geyBzZXRTZW50KGZhbHNlKTsgc2V0RW1haWwoXCJcIik7IH19IHN0eWxlPXt7IGZvbnRTaXplOiAxNCB9fT5cbiAgICAgICAgICAgICAgICByZW52b3llciBcdTAwRTAgdW4gYXV0cmUgZW1haWxcbiAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApIDogKFxuICAgICAgICAgICAgPD5cbiAgICAgICAgICAgICAgey8qIFRhYnMgKi99XG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiBcImZsZXhcIiwgZ2FwOiA0LCBtYXJnaW5Cb3R0b206IFwidmFyKC0tcy01KVwiLFxuICAgICAgICAgICAgICAgIGJvcmRlckJvdHRvbTogXCIxcHggc29saWQgdmFyKC0tYXNoLWRlZXApXCIsXG4gICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgIHtbXG4gICAgICAgICAgICAgICAgICBbXCJzaWduaW5cIiwgXCJzZSBjb25uZWN0ZXJcIl0sXG4gICAgICAgICAgICAgICAgICBbXCJzaWdudXBcIiwgXCJjclx1MDBFOWVyIHVuIGNvbXB0ZVwiXSxcbiAgICAgICAgICAgICAgICAgIFtcIm1hZ2ljXCIsIFwibGllbiBtYWdpcXVlXCJdLFxuICAgICAgICAgICAgICAgIF0ubWFwKChbaywgbF0pID0+IChcbiAgICAgICAgICAgICAgICAgIDxidXR0b24ga2V5PXtrfVxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7IHNldFRhYihrKTsgc2V0RXJyb3IobnVsbCk7IHNldEluZm8obnVsbCk7IHNldFNlbnQoZmFsc2UpOyB9fVxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICAgIGZsZXg6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogXCJ0cmFuc3BhcmVudFwiLCBib3JkZXI6IFwibm9uZVwiLCBjdXJzb3I6IFwicG9pbnRlclwiLFxuICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6IFwiMTBweCA4cHhcIixcbiAgICAgICAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGZvbnRTaXplOiAxMyxcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogdGFiID09PSBrID8gXCJ2YXIoLS1zaWxrLWdvbGQpXCIgOiBcInZhcigtLWFzaC1saWdodClcIixcbiAgICAgICAgICAgICAgICAgICAgICBib3JkZXJCb3R0b206IHRhYiA9PT0gayA/IFwiMXB4IHNvbGlkIHZhcigtLXNpbGstZ29sZClcIiA6IFwiMXB4IHNvbGlkIHRyYW5zcGFyZW50XCIsXG4gICAgICAgICAgICAgICAgICAgICAgbWFyZ2luQm90dG9tOiAtMSxcbiAgICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiBcImFsbCAyODBtcyBlYXNlXCIsXG4gICAgICAgICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgICAgICB7bH1cbiAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICB0eXBlPVwiZW1haWxcIlxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiZW1haWxcIlxuICAgICAgICAgICAgICAgIHZhbHVlPXtlbWFpbH1cbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHsgc2V0RW1haWwoZS50YXJnZXQudmFsdWUpOyBzZXRFcnJvcihudWxsKTsgfX1cbiAgICAgICAgICAgICAgICBvbktleURvd249eyhlKSA9PiB7IGlmIChlLmtleSA9PT0gXCJFbnRlclwiICYmIHRhYiA9PT0gXCJtYWdpY1wiKSBzdWJtaXQoKTsgfX1cbiAgICAgICAgICAgICAgICBkaXNhYmxlZD17c2VuZGluZ31cbiAgICAgICAgICAgICAgICBzdHlsZT17aW5wdXRTdHlsZX1cbiAgICAgICAgICAgICAgLz5cblxuICAgICAgICAgICAgICB7dGFiICE9PSBcIm1hZ2ljXCIgJiYgKFxuICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgdHlwZT1cInBhc3N3b3JkXCJcbiAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPXt0YWIgPT09IFwic2lnbnVwXCIgPyBcIm1vdCBkZSBwYXNzZSAoNiBtaW4uKVwiIDogXCJtb3QgZGUgcGFzc2VcIn1cbiAgICAgICAgICAgICAgICAgIHZhbHVlPXtwYXNzd29yZH1cbiAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4geyBzZXRQYXNzd29yZChlLnRhcmdldC52YWx1ZSk7IHNldEVycm9yKG51bGwpOyB9fVxuICAgICAgICAgICAgICAgICAgb25LZXlEb3duPXsoZSkgPT4geyBpZiAoZS5rZXkgPT09IFwiRW50ZXJcIikgc3VibWl0KCk7IH19XG4gICAgICAgICAgICAgICAgICBkaXNhYmxlZD17c2VuZGluZ31cbiAgICAgICAgICAgICAgICAgIHN0eWxlPXtpbnB1dFN0eWxlfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICl9XG5cbiAgICAgICAgICAgICAge2Vycm9yICYmIChcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1ldGEgbWItbVwiIHN0eWxlPXt7IGNvbG9yOiBcInZhcigtLWVtYmVyLWxpdmUpXCIsIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgbWFyZ2luVG9wOiA4IH19PlxuICAgICAgICAgICAgICAgICAge2Vycm9yfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICB7aW5mbyAmJiAoXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZXRhIG1iLW1cIiBzdHlsZT17eyBjb2xvcjogXCJ2YXIoLS1zaWxrLWdvbGQpXCIsIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgbWFyZ2luVG9wOiA4IH19PlxuICAgICAgICAgICAgICAgICAge2luZm99XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICl9XG5cbiAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ0bi1naG9zdFwiXG4gICAgICAgICAgICAgICAgb25DbGljaz17c3VibWl0fVxuICAgICAgICAgICAgICAgIGRpc2FibGVkPXtzZW5kaW5nIHx8ICFlbWFpbC50cmltKCkgfHwgKHRhYiAhPT0gXCJtYWdpY1wiICYmICFwYXNzd29yZCl9XG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIHdpZHRoOiBcIjEwMCVcIixcbiAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IChzZW5kaW5nIHx8ICFlbWFpbC50cmltKCkgfHwgKHRhYiAhPT0gXCJtYWdpY1wiICYmICFwYXNzd29yZCkpID8gMC40IDogMSxcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmc6IFwiMTRweCAxNnB4XCIsXG4gICAgICAgICAgICAgICAgICBtYXJnaW5Ub3A6IDEyLFxuICAgICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgIHtzZW5kaW5nID8gXCJcdTIwMjZcIiA6IHRhYiA9PT0gXCJzaWduaW5cIiA/IFwiZW50cmVyXCIgOiB0YWIgPT09IFwic2lnbnVwXCIgPyBcImNyXHUwMEU5ZXJcIiA6IFwiZW52b3llciBsZSBsaWVuXCJ9XG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuXG4gICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cIm1ldGEgb3AtNzAgbXQtbCB0ZXh0LWNlbnRlclwiIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLCBmb250U2l6ZTogMTIsXG4gICAgICAgICAgICAgICAgbGluZUhlaWdodDogMS42LFxuICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICB7dGFiID09PSBcInNpZ25pblwiICYmIFwicGFzIGRlIGNvbXB0ZSA/IGJhc2N1bGUgc3VyIFxcXCJjclx1MDBFOWVyIHVuIGNvbXB0ZVxcXCJcIn1cbiAgICAgICAgICAgICAgICB7dGFiID09PSBcInNpZ251cFwiICYmIFwidG9uIG1vdCBkZSBwYXNzZSBzZXJhIHRhIGNsXHUwMEU5IHBvdXIgcmV2ZW5pclwifVxuICAgICAgICAgICAgICAgIHt0YWIgPT09IFwibWFnaWNcIiAmJiBcImF1Y3VuIG1vdCBkZSBwYXNzZSBcdTIwMTQgdW4gbGllbiBkYW5zIHVuZSBtaW51dGVcIn1cbiAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9O1xuXG4gIGNvbnN0IGlucHV0U3R5bGUgPSB7XG4gICAgd2lkdGg6IFwiMTAwJVwiLFxuICAgIHBhZGRpbmc6IFwiMTRweCAxNnB4XCIsXG4gICAgYmFja2dyb3VuZDogXCJ0cmFuc3BhcmVudFwiLFxuICAgIGJvcmRlcjogXCIxcHggc29saWQgdmFyKC0tYXNoLWRlZXApXCIsXG4gICAgY29sb3I6IFwidmFyKC0tYm9uZSlcIixcbiAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLFxuICAgIGZvbnRTaXplOiAxNyxcbiAgICBvdXRsaW5lOiBcIm5vbmVcIixcbiAgICBtYXJnaW5Cb3R0b206IDEwLFxuICAgIGJveFNpemluZzogXCJib3JkZXItYm94XCIsXG4gIH07XG5cbiAgY29uc3QgTG9hZGluZyA9ICgpID0+IChcbiAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICBtaW5IZWlnaHQ6IFwiMTAwdmhcIixcbiAgICAgIGRpc3BsYXk6IFwiZmxleFwiLFxuICAgICAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcbiAgICAgIGp1c3RpZnlDb250ZW50OiBcImNlbnRlclwiLFxuICAgICAgYmFja2dyb3VuZDogXCJ2YXIoLS1uaWdodC1mbG9vcilcIixcbiAgICB9fT5cbiAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgd2lkdGg6IDMyLCBoZWlnaHQ6IDMyLFxuICAgICAgICBib3JkZXJSYWRpdXM6IFwiNTAlXCIsXG4gICAgICAgIGJvcmRlcjogXCIxcHggc29saWQgdmFyKC0tYXNoLW1pZClcIixcbiAgICAgICAgYW5pbWF0aW9uOiBcImhhbG8tc2xvdyAzcyBlYXNlLWluLW91dCBpbmZpbml0ZVwiLFxuICAgICAgfX0gLz5cbiAgICA8L2Rpdj5cbiAgKTtcblxuICBjb25zdCBBdXRoR2F0ZSA9ICh7IGNoaWxkcmVuIH0pID0+IHtcbiAgICBjb25zdCBbc3RhdHVzLCBzZXRTdGF0dXNdID0gdUFTKFwibG9hZGluZ1wiKTsgLy8gbG9hZGluZyB8IHNpZ25lZF9pbiB8IHNpZ25lZF9vdXRcbiAgICBjb25zdCBbdXNlciwgc2V0VXNlcl0gPSB1QVMobnVsbCk7XG5cbiAgICB1QUUoKCkgPT4ge1xuICAgICAgbGV0IGNhbmNlbGxlZCA9IGZhbHNlO1xuICAgICAgbGV0IGluaXRpYWxSZXNvbHZlZCA9IGZhbHNlO1xuXG4gICAgICAvLyBOby1hdXRoIG1vZGUgKG5vIFN1cGFiYXNlIGxvYWRlZCBPUiA/ZGVtbz0xKSBcdTIxOTIgYnlwYXNzIGdhdGVcbiAgICAgIGlmICh3aW5kb3cuRHJlYW1BdXRoPy5ub0F1dGgpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbQXV0aEdhdGVdIG5vLWF1dGggbW9kZSBcdTIxOTIgYnlwYXNzIGdhdGVcIik7XG4gICAgICAgIHNldFVzZXIoeyBpZDogXCJkZW1vLXVzZXJcIiwgZW1haWw6IFwiZGVtb0BpbmZ1c2UuZWFydGhcIiB9KTtcbiAgICAgICAgc2V0U3RhdHVzKFwic2lnbmVkX2luXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIEluaXRpYWwgc2Vzc2lvbiBjaGVjayAoc291cmNlIG9mIHRydXRoIGZvciBmaXJzdCBwYWludClcbiAgICAgIHdpbmRvdy5EcmVhbUF1dGguZ2V0U2Vzc2lvbigpLnRoZW4oKHNlc3Npb24pID0+IHtcbiAgICAgICAgaWYgKGNhbmNlbGxlZCkgcmV0dXJuO1xuICAgICAgICBpbml0aWFsUmVzb2x2ZWQgPSB0cnVlO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltBdXRoR2F0ZV0gaW5pdGlhbCBnZXRTZXNzaW9uIFx1MjE5MlwiLCBzZXNzaW9uPy51c2VyPy5lbWFpbCB8fCBcIm5vIHNlc3Npb25cIik7XG4gICAgICAgIGlmIChzZXNzaW9uPy51c2VyKSB7XG4gICAgICAgICAgc2V0VXNlcihzZXNzaW9uLnVzZXIpO1xuICAgICAgICAgIHNldFN0YXR1cyhcInNpZ25lZF9pblwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZXRTdGF0dXMoXCJzaWduZWRfb3V0XCIpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgLy8gTGlzdGVuIGZvciBFWFBMSUNJVCBhdXRoIGV2ZW50cyBPTkxZLlxuICAgICAgLy8gSWdub3JlIElOSVRJQUxfU0VTU0lPTiAoaGFuZGxlZCBieSBnZXRTZXNzaW9uIGFib3ZlKSBhbmQgVE9LRU5fUkVGUkVTSEVEXG4gICAgICAvLyAodHJhbnNwYXJlbnQgXHUyMDE0IHVzZXIgc3RheXMgc2lnbmVkIGluKS5cbiAgICAgIGNvbnN0IHVuc3ViID0gd2luZG93LkRyZWFtQXV0aC5vbkF1dGhDaGFuZ2UoKGV2ZW50LCBzZXNzaW9uKSA9PiB7XG4gICAgICAgIGlmIChjYW5jZWxsZWQpIHJldHVybjtcbiAgICAgICAgY29uc29sZS5sb2coXCJbQXV0aEdhdGVdIGV2ZW50OlwiLCBldmVudCwgXCJ1c2VyOlwiLCBzZXNzaW9uPy51c2VyPy5lbWFpbCB8fCBcIm5vbmVcIiwgXCJpbml0aWFsUmVzb2x2ZWQ6XCIsIGluaXRpYWxSZXNvbHZlZCk7XG5cbiAgICAgICAgLy8gRGVmZW5zaXZlIDogaWdub3JlIEFOWSBldmVudCBiZWZvcmUgZ2V0U2Vzc2lvbiByZXNvbHZlcyB0byBhdm9pZCByYWNlXG4gICAgICAgIGlmICghaW5pdGlhbFJlc29sdmVkKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJbQXV0aEdhdGVdIGlnbm9yaW5nIGV2ZW50IChpbml0aWFsIG5vdCByZXNvbHZlZCB5ZXQpXCIpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChldmVudCA9PT0gXCJJTklUSUFMX1NFU1NJT05cIikgcmV0dXJuO1xuICAgICAgICBpZiAoZXZlbnQgPT09IFwiVE9LRU5fUkVGUkVTSEVEXCIpIHtcbiAgICAgICAgICBpZiAoc2Vzc2lvbj8udXNlcikgc2V0VXNlcihzZXNzaW9uLnVzZXIpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXZlbnQgPT09IFwiU0lHTkVEX0lOXCIgJiYgc2Vzc2lvbj8udXNlcikge1xuICAgICAgICAgIHNldFVzZXIoc2Vzc2lvbi51c2VyKTtcbiAgICAgICAgICBzZXRTdGF0dXMoXCJzaWduZWRfaW5cIik7XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQgPT09IFwiU0lHTkVEX09VVFwiIHx8IGV2ZW50ID09PSBcIlVTRVJfREVMRVRFRFwiKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJbQXV0aEdhdGVdIGV4cGxpY2l0IFNJR05FRF9PVVQgXHUyMTkyIGZsaXBwaW5nIHRvIHNpZ25lZF9vdXRcIik7XG4gICAgICAgICAgc2V0VXNlcihudWxsKTtcbiAgICAgICAgICBzZXRTdGF0dXMoXCJzaWduZWRfb3V0XCIpO1xuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50ID09PSBcIlVTRVJfVVBEQVRFRFwiICYmIHNlc3Npb24/LnVzZXIpIHtcbiAgICAgICAgICBzZXRVc2VyKHNlc3Npb24udXNlcik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gKCkgPT4geyBjYW5jZWxsZWQgPSB0cnVlOyB1bnN1YigpOyB9O1xuICAgIH0sIFtdKTtcblxuICAgIC8vIEV4cG9zZSB1c2VyIGdsb2JhbGx5IGZvciBzY3JlZW5zIChkZWJ1ZywgZmVlZGJhY2ssIGV0Yy4pXG4gICAgdUFFKCgpID0+IHtcbiAgICAgIHdpbmRvdy5EcmVhbVVzZXIgPSB1c2VyO1xuICAgIH0sIFt1c2VyXSk7XG5cbiAgICBpZiAoc3RhdHVzID09PSBcImxvYWRpbmdcIikgcmV0dXJuIDxMb2FkaW5nIC8+O1xuICAgIGlmIChzdGF0dXMgPT09IFwic2lnbmVkX291dFwiKSByZXR1cm4gPFNpZ25JblNjcmVlbiBvblNpZ25Jbj17KCkgPT4gc2V0U3RhdHVzKFwibG9hZGluZ1wiKX0gLz47XG4gICAgcmV0dXJuIGNoaWxkcmVuO1xuICB9O1xuXG4gIHdpbmRvdy5BdXRoR2F0ZSA9IEF1dGhHYXRlO1xuICB3aW5kb3cuU2lnbkluU2NyZWVuID0gU2lnbkluU2NyZWVuO1xufSkoKTtcbiJdLAogICJtYXBwaW5ncyI6ICJDQWNDLFNBQVMsaUJBQWlCO0FBZDNCO0FBZUUsUUFBTSxlQUFlLE9BQU8sZ0JBQWdCO0FBQzVDLFFBQU0sb0JBQW9CLE9BQU8scUJBQXFCO0FB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
