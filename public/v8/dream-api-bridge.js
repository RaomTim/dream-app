/* ============================================================
   DREAM V8 — API BRIDGE
   ────────────────────────────────────────────────────────────
   Ponte le V8 self-contained vers les vraies routes Next.js
   (Anima chat SSE, Whisper voice, Kairos, Sagesse polyphonique,
   Portrait, Oracle Corps).

   Crisis-safe regex local actif (NON-NÉGOCIABLE).
   Auth Supabase OTP code 6-10 chiffres (migré 2026-05-16, plus de magic link).
   Mode atmosphérique auto heure browser.
   localStorage persistance états UI.

   Ne touche PAS aux animations / styles V8.
   Override uniquement les fonctions mock par leurs vrais appels.

   2026-05-11 — Yeshua, alpha tactical
   2026-05-16 — OTP code 6 chiffres (sendOtp + verifyOtp), UI 2 étapes
   ============================================================ */

(function dreamBridge() {
  'use strict';

  /* ─── DREAM API CLIENT ─── */
  const DreamAPI = window.DreamAPI = {
    _accessToken: null,
    _userId: null,
    _sessionId: null,

    async _headers() {
      const h = { 'Content-Type': 'application/json' };
      if (this._accessToken) h['Authorization'] = 'Bearer ' + this._accessToken;
      return h;
    },

    async _headersForm() {
      const h = {};
      if (this._accessToken) h['Authorization'] = 'Bearer ' + this._accessToken;
      return h;
    },

    async createKairos(data) {
      try {
        const r = await fetch('/api/kairos', {
          method: 'POST',
          headers: await this._headers(),
          body: JSON.stringify(data)
        });
        return await r.json();
      } catch (e) {
        console.error('[DreamAPI] createKairos failed:', e);
        return { error: e.message };
      }
    },

    async listKairos(filters = {}) {
      try {
        const params = new URLSearchParams(filters);
        const r = await fetch(`/api/kairos?${params}`, {
          headers: await this._headers()
        });
        return await r.json();
      } catch (e) {
        console.error('[DreamAPI] listKairos failed:', e);
        return { kairos: [], error: e.message };
      }
    },

    /**
     * Chat Anima — POST /api/dream-chat/converse + SSE parse manuel
     * @param {string} message
     * @param {function} onChunk (text)
     * @param {function} onDone ({session_id})
     * @param {function} onError (err)
     */
    async chatAnima(message, onChunk, onDone, onError) {
      try {
        const res = await fetch('/api/dream-chat/converse', {
          method: 'POST',
          headers: await this._headers(),
          body: JSON.stringify({ message })
        });
        if (!res.ok || !res.body) {
          const txt = await res.text().catch(() => '');
          onError && onError('HTTP ' + res.status + ': ' + txt.slice(0, 200));
          return;
        }
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let totalText = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          // SSE format : "data: {...}\n\n"
          const lines = buffer.split(/\n\n+/);
          buffer = lines.pop(); // keep partial line
          for (const block of lines) {
            for (const line of block.split('\n')) {
              if (!line.startsWith('data: ')) continue;
              try {
                const payload = JSON.parse(line.slice(6));
                if (payload.type === 'chunk' && payload.text) {
                  totalText += payload.text;
                  onChunk && onChunk(payload.text, totalText);
                } else if (payload.type === 'done') {
                  onDone && onDone(payload);
                  return;
                } else if (payload.type === 'error') {
                  onError && onError(payload.error || 'unknown error');
                  return;
                } else if (payload.type === 'session') {
                  this._sessionId = payload.session_id;
                }
              } catch (e) {
                console.warn('[DreamAPI] SSE parse error:', e, line);
              }
            }
          }
        }
        // Stream ended without explicit 'done'
        onDone && onDone({ text: totalText });
      } catch (e) {
        console.error('[DreamAPI] chatAnima failed:', e);
        onError && onError(e.message);
      }
    },

    async summonKairosWisdom(payload) {
      try {
        const r = await fetch('/api/journal/summon-kairos-wisdom', {
          method: 'POST',
          headers: await this._headers(),
          body: JSON.stringify(payload || {})
        });
        return await r.json();
      } catch (e) {
        return { error: e.message };
      }
    },

    async getPortrait(toggle = 'crossed', period = 'lune') {
      try {
        const r = await fetch('/api/portrait/narrative-reading', {
          method: 'POST',
          headers: await this._headers(),
          body: JSON.stringify({ toggle, period })
        });
        return await r.json();
      } catch (e) {
        return { error: e.message };
      }
    },

    async createBodyMarker(data) {
      try {
        const r = await fetch('/api/oracle-corps/markers', {
          method: 'POST',
          headers: await this._headers(),
          body: JSON.stringify(data)
        });
        return await r.json();
      } catch (e) {
        return { error: e.message };
      }
    },

    async readBodyZone(payload) {
      try {
        const r = await fetch('/api/oracle-corps/reading', {
          method: 'POST',
          headers: await this._headers(),
          body: JSON.stringify(payload)
        });
        return await r.json();
      } catch (e) {
        return { error: e.message };
      }
    },

    async transcribeVoice(audioBlob) {
      try {
        const fd = new FormData();
        fd.append('audio', audioBlob, 'voice.webm');
        const r = await fetch('/api/transcribe', {
          method: 'POST',
          headers: await this._headersForm(),
          body: fd
        });
        return await r.json();
      } catch (e) {
        return { error: e.message };
      }
    },
  };

  /* ─── CRISIS-SAFE LOCAL DETECTION (non-négociable) ─── */
  // V8 fix P0-3 — patterns enrichis depuis le sprint (13 patterns). Le sprint expose
  // window.__sprintCrisisPatterns et window.__sprintCrisisDetect ; on prend le sur-ensemble
  // si dispo, sinon on retombe sur cette liste élargie.
  const CRISIS_PATTERNS = [
    /\b(suicid|me tuer|me supprimer|en finir|me faire mal|me faire du mal)\b/i,
    /\b(self.?harm|kill.?myself|end.?it.?all|want.?to.?die)\b/i,
    /\b(plus envie de vivre|veux mourir|veux plus vivre|disparaître|en avoir fini)\b/i,
    /\b(les voix me disent|je suis l[eé]lu|tout le monde me veut du mal)\b/i,
    // ajouts P0-3 (sprint patterns)
    /tout le monde me veut du mal/i,
    /je suis l['']?élu/i,
    /le système me parle directement/i,
    /les voix me disent (quoi faire|de)/i,
    /(veux|envie de) disparaître/i,
    /(veux|envie de) mourir/i,
    /plus envie( de vivre)?/i,
    /plus de raison de vivre/i,
    /personne ne me comprend/i,
    /je suis seul au monde/i,
    /envie d['']en finir/i,
    /en finir avec (tout|moi|la vie)/i,
    /me suicider|suicide/i
  ];
  window.checkCrisisLocal = function(text) {
    if (!text) return false;
    // priorité : si le sprint a exposé son detector, on l'utilise (sur-ensemble validé)
    if (typeof window.__sprintCrisisDetect === 'function') {
      try { if (window.__sprintCrisisDetect(text)) return true; } catch (e) {}
    }
    for (const p of CRISIS_PATTERNS) if (p.test(text)) return true;
    return false;
  };

  /* ─── MODE ATMOSPHÉRIQUE AUTO ─── */
  function detectAtmosphericMode() {
    const h = new Date().getHours();
    if (h >= 21 || h < 1) return 'pre-sommeil';
    if (h >= 5 && h < 7) return 'aube';
    if (h >= 7 && h < 9) return 'reveil';
    if (h >= 9 && h < 14) return 'jour-actif';
    if (h >= 14 && h < 17) return 'reverie';
    if (h >= 17 && h < 21) return 'soir';
    return 'pre-sommeil';
  }
  const savedMode = localStorage.getItem('dream_mode_override');
  window.currentAtmosphericMode = savedMode || detectAtmosphericMode();
  document.documentElement.dataset.mode = window.currentAtmosphericMode;
  if (document.body) document.body.dataset.mode = window.currentAtmosphericMode;

  /* ─── AUTH SUPABASE (OTP code 6 chiffres) ─── */
  async function initAuth() {
    if (!window.supabase || !window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) {
      console.error('[DreamAuth] Supabase config missing');
      return null;
    }
    const client = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'dream-app-supabase-auth',
        flowType: 'implicit',
      }
    });
    window.DreamSupabase = client;

    const { data } = await client.auth.getSession();
    if (data?.session) {
      DreamAPI._accessToken = data.session.access_token;
      DreamAPI._userId = data.session.user.id;
      console.log('[DreamAuth] signed in as', data.session.user.email);
    }
    // refresh on change
    client.auth.onAuthStateChange((event, session) => {
      if (session) {
        DreamAPI._accessToken = session.access_token;
        DreamAPI._userId = session.user.id;
      } else {
        DreamAPI._accessToken = null;
        DreamAPI._userId = null;
      }
      // clean any residual hash (magic-link backward compat)
      if (event === 'SIGNED_IN' && location.hash.includes('access_token')) {
        try { history.replaceState(null, '', location.pathname); } catch {}
        location.reload();
      }
    });
    return client;
  }

  /* ─── SEND OTP CODE (no redirect URL → forces code mode) ─── */
  async function sendOtp(email) {
    const { error } = await window.DreamSupabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        // No emailRedirectTo → Supabase sends {{ .Token }} only when template uses it
        // (Tim must update Supabase email template — see OTP-MIGRATION-INSTRUCTIONS.md)
      }
    });
    return error;
  }

  /* ─── VERIFY OTP CODE → establish native session ─── */
  async function verifyOtp(email, code) {
    const { data, error } = await window.DreamSupabase.auth.verifyOtp({
      email,
      token: code.trim(),
      type: 'email'
    });
    if (!error && data?.session) {
      DreamAPI._accessToken = data.session.access_token;
      DreamAPI._userId = data.session.user.id;
    }
    return { data, error };
  }

  /* ─── AUTH SCREEN OVERLAY (2-step OTP) ─── */
  function injectAuthScreen() {
    const html = `
      <div id="dream-auth-overlay" style="position:fixed;inset:0;z-index:99999;background:#0E0F14;color:#E8E4DD;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:32px;font-family:'EB Garamond',Garamond,Georgia,serif;">
        <div style="max-width:380px;width:100%;text-align:center;">
          <div style="font-size:48px;font-style:italic;letter-spacing:0.02em;margin-bottom:8px;color:#D4AF37;">Dream</div>
          <div id="dream-auth-subtitle" style="font-size:14px;font-style:italic;opacity:0.7;margin-bottom:36px;line-height:1.6;">le compas onirique<br>entre ton email pour recevoir ton code</div>

          <!-- Étape 1 : email -->
          <div id="dream-auth-step1">
            <input id="dream-auth-email" type="email" placeholder="ton.email@…" autocomplete="email" style="width:100%;padding:14px 18px;background:transparent;border:1px solid #6C6557;border-radius:2px;color:#E8E4DD;font-size:15px;font-family:inherit;font-style:italic;outline:none;margin-bottom:14px;text-align:center;box-sizing:border-box;">
            <button id="dream-auth-send" style="width:100%;padding:14px 18px;background:transparent;border:1px solid #D4AF37;color:#D4AF37;border-radius:2px;font-size:15px;font-family:inherit;font-style:italic;cursor:pointer;letter-spacing:0.04em;">recevoir le code</button>
          </div>

          <!-- Étape 2 : code OTP (masqué initialement) -->
          <div id="dream-auth-step2" style="display:none;">
            <input id="dream-auth-otp" type="tel" placeholder="· · · · · ·" maxlength="10" autocomplete="one-time-code" inputmode="numeric" pattern="\d{6,10}" style="width:100%;padding:16px 18px;background:transparent;border:1px solid #6C6557;border-radius:2px;color:#D4AF37;font-size:28px;font-family:'JetBrains Mono',Menlo,monospace;font-style:normal;outline:none;margin-bottom:14px;text-align:center;letter-spacing:0.25em;box-sizing:border-box;">
            <button id="dream-auth-verify" style="width:100%;padding:14px 18px;background:transparent;border:1px solid #D4AF37;color:#D4AF37;border-radius:2px;font-size:15px;font-family:inherit;font-style:italic;cursor:pointer;letter-spacing:0.04em;">valider le code</button>
            <button id="dream-auth-resend" style="margin-top:10px;width:100%;padding:10px 18px;background:transparent;border:1px solid #3A3D46;color:#B8B4AD;border-radius:2px;font-size:12px;font-family:inherit;font-style:italic;cursor:pointer;letter-spacing:0.04em;">renvoyer le code</button>
          </div>

          <div id="dream-auth-msg" style="margin-top:20px;font-size:13px;font-style:italic;opacity:0.75;min-height:20px;line-height:1.5;"></div>
          <div style="margin-top:48px;font-size:11px;opacity:0.4;font-style:italic;">aucun mot de passe — un code par email</div>
        </div>
      </div>
    `;
    const div = document.createElement('div');
    div.innerHTML = html;
    document.body.appendChild(div.firstElementChild);

    const $email = document.getElementById('dream-auth-email');
    const $send = document.getElementById('dream-auth-send');
    const $otp = document.getElementById('dream-auth-otp');
    const $verify = document.getElementById('dream-auth-verify');
    const $resend = document.getElementById('dream-auth-resend');
    const $msg = document.getElementById('dream-auth-msg');
    const $step1 = document.getElementById('dream-auth-step1');
    const $step2 = document.getElementById('dream-auth-step2');
    const $subtitle = document.getElementById('dream-auth-subtitle');

    // Store email across steps
    let _email = '';

    async function handleSend() {
      const email = ($email.value || '').trim().toLowerCase();
      if (!email || !/.+@.+\..+/.test(email)) {
        $msg.textContent = 'email invalide';
        return;
      }
      _email = email;
      $send.disabled = true;
      $send.style.opacity = '0.5';
      $msg.textContent = 'envoi en cours…';
      try {
        const error = await sendOtp(email);
        if (error) {
          $msg.textContent = error.message;
          $send.disabled = false;
          $send.style.opacity = '1';
        } else {
          // Transition to step 2
          $step1.style.display = 'none';
          $step2.style.display = 'block';
          $subtitle.innerHTML = 'code envoyé à <span style="color:#D4AF37;font-style:normal;">' + escapeHtml(email) + '</span><br>entre le code reçu par email';
          $msg.textContent = '';
          setTimeout(() => $otp.focus(), 200);
        }
      } catch (e) {
        $msg.textContent = e.message;
        $send.disabled = false;
        $send.style.opacity = '1';
      }
    }

    async function handleVerify() {
      const code = ($otp.value || '').trim().replace(/\s/g, '');
      if (!code || !/^\d{6,10}$/.test(code)) {
        $msg.textContent = 'entre le code reçu par email';
        return;
      }
      $verify.disabled = true;
      $verify.style.opacity = '0.5';
      $msg.textContent = 'vérification…';
      try {
        const { error } = await verifyOtp(_email, code);
        if (error) {
          $msg.textContent = error.message;
          $verify.disabled = false;
          $verify.style.opacity = '1';
          $otp.value = '';
        } else {
          $msg.textContent = 'bienvenue dans le rêve ✦';
          setTimeout(() => {
            removeAuthScreen();
            setTimeout(() => {
              try { wireAppHooks(); } catch (e) { console.error('[DreamBridge] wireAppHooks failed:', e); }
              maybeShowOnboarding();
            }, 100);
          }, 800);
        }
      } catch (e) {
        $msg.textContent = e.message;
        $verify.disabled = false;
        $verify.style.opacity = '1';
      }
    }

    async function handleResend() {
      $otp.value = '';
      $msg.textContent = 'renvoi en cours…';
      $resend.disabled = true;
      try {
        const error = await sendOtp(_email);
        $msg.textContent = error ? error.message : 'nouveau code envoyé — vérifie ton email';
      } catch (e) {
        $msg.textContent = e.message;
      } finally {
        setTimeout(() => { $resend.disabled = false; }, 30000); // 30s cooldown
      }
    }

    $send.addEventListener('click', handleSend);
    $email.addEventListener('keydown', e => { if (e.key === 'Enter') handleSend(); });
    $verify.addEventListener('click', handleVerify);
    $otp.addEventListener('keydown', e => { if (e.key === 'Enter') handleVerify(); });
    // Auto-verify quand longueur correspond (6 OU 8 chiffres typiques Supabase)
    $otp.addEventListener('input', () => {
      const v = ($otp.value || '').trim();
      if (/^\d{6}$/.test(v) || /^\d{8}$/.test(v)) handleVerify();
    });
    $resend.addEventListener('click', handleResend);
    setTimeout(() => $email.focus(), 300);
  }

  function removeAuthScreen() {
    const el = document.getElementById('dream-auth-overlay');
    if (el) el.remove();
  }

  /* ─── BIND APP HOOKS ─── */
  // V8 declares functions at script top-level → they ARE on window in non-module scripts.
  // BUT the inline listeners in V8 capture lexical bindings, so simply re-assigning
  // window.simulateAnimaResponse won't intercept the existing keydown listener.
  // Strategy: REPLACE the chat input listeners by cloning the element. This kills
  // ALL existing listeners. We then bind our own listener that does the real flow.
  function wireAppHooks() {
    function addRealAnimaMessage(text) {
      const cz = document.getElementById('chat-zone');
      if (!cz) return;
      const m = document.createElement('div');
      m.className = 'message from-anima';
      m.textContent = text;
      cz.appendChild(m);
      cz.scrollTop = cz.scrollHeight;
    }
    function addRealUserMessage(text) {
      const cz = document.getElementById('chat-zone');
      if (!cz) return;
      const m = document.createElement('div');
      m.className = 'message from-user';
      m.textContent = text;
      cz.appendChild(m);
      cz.scrollTop = cz.scrollHeight;
    }
    // Expose for other parts of bridge
    window.__dreamAddAnima = addRealAnimaMessage;
    window.__dreamAddUser = addRealUserMessage;

    function streamAnimaResponse(message) {
      // Show typing indicator
      const cz = document.getElementById('chat-zone');
      let bubble = null;
      if (cz) {
        bubble = document.createElement('div');
        bubble.className = 'message from-anima streaming';
        bubble.textContent = '…';
        cz.appendChild(bubble);
        cz.scrollTop = cz.scrollHeight;
      }
      DreamAPI.chatAnima(
        message,
        (chunk, total) => {
          if (bubble) {
            bubble.textContent = total;
            if (cz) cz.scrollTop = cz.scrollHeight;
          }
        },
        (final) => {
          if (bubble) bubble.classList.remove('streaming');
          if (window.triggerResonance) try { window.triggerResonance(); } catch (e) {}
        },
        (err) => {
          console.warn('[Anima] stream error:', err);
          if (bubble) {
            bubble.classList.remove('streaming');
            bubble.textContent = 'on pourrait y rester un peu, sans le retoucher tout de suite. (réseau silencieux)';
          }
        }
      );
    }
    window.__dreamStreamAnima = streamAnimaResponse;

    // REPLACE the chat input listener entirely (clone + rebind)
    const oldInput = document.getElementById('chat-input');
    if (oldInput) {
      const newInput = oldInput.cloneNode(true);
      oldInput.parentNode.replaceChild(newInput, oldInput);
      newInput.addEventListener('keydown', async (e) => {
        if (e.key !== 'Enter') return;
        const t = newInput.value.trim();
        if (!t) return;
        newInput.value = '';
        addRealUserMessage(t);
        // Crisis check local FIRST
        if (window.checkCrisisLocal(t)) {
          addRealAnimaMessage(`Ce que tu portes maintenant est trop lourd pour être tenu par moi seule. Quelqu'un de chair, maintenant, voici les voies —

3114 — Numéro national de prévention du suicide (gratuit, 24/7, anonyme)
SOS Amitié — 09 72 39 40 50
SOS Suicide Phénix — 01 40 44 46 45

Si urgence vitale immédiate → 15 (SAMU) ou 112.

Je m'efface ici. Je serai là quand tu reviens.`);
          if (window.__sprint && window.__sprint.openSanctuaire) {
            try { window.__sprint.openSanctuaire({ crisis: true }); } catch (e) {}
          }
          return;
        }
        // If "capter" mode armed, also save as kairos
        if (window._dreamCapterArmed) {
          window._dreamCapterArmed = false;
          DreamAPI.createKairos({ raw_text: t, kairos_type: 'reve', capture_method: 'text' });
        }
        // V8 fix P0-2 body-keywords — le rewired listener lit inp.value APRÈS que le bridge
        // l'a déjà effacé (newInput.value = '' ci-dessus). Root cause du bug "body suggest ne
        // déclenche jamais". Fix : déclencher ici, avec `t` capturé AVANT l'effacement.
        // On délègue à __rewireBodyKeywords s'il expose une fn directe, sinon check inline.
        setTimeout(() => {
          const BODY_KW = /douleur|mal\b|blesse|coupé|coupée|brûlé|brûlée|frisson|vertige|palpitation|crispation|nœud|noeud|boule\b|tension/i;
          if (BODY_KW.test(t) && typeof addAnimaMessage === 'function') {
            addAnimaMessage('on peut écouter ton corps si tu veux.');
            setTimeout(() => {
              const sugg = document.createElement('div');
              sugg.className = 'anima-suggest';
              sugg.style.cssText = 'cursor:pointer;padding:10px 14px;background:color-mix(in srgb,var(--accent) 14%, transparent);border:1px solid color-mix(in srgb,var(--accent) 35%,transparent);border-radius:10px;margin:8px 0;font-family:var(--serif-cont);font-style:italic;font-size:13.5px;color:var(--bone);';
              sugg.innerHTML = '◯ ouvrir l\'oracle du corps →';
              sugg.addEventListener('click', () => {
                if (window.__sprint && typeof window.__sprint.openOracleCorpsApp === 'function') {
                  window.__sprint.openOracleCorpsApp();
                } else if (typeof window.openOracleCorps === 'function') {
                  window.openOracleCorps();
                }
              });
              const cz = document.getElementById('chat-zone');
              if (cz) { cz.appendChild(sugg); cz.scrollTop = cz.scrollHeight; }
            }, 800);
          }
        }, 1650);
        // Real Anima streaming
        streamAnimaResponse(t);
      });
    }
    // ALSO rebind send-btn (in case V8 dispatches synthetic Enter to old input)
    const sendBtn = document.getElementById('send-btn');
    if (sendBtn) {
      const newSend = sendBtn.cloneNode(true);
      sendBtn.parentNode.replaceChild(newSend, sendBtn);
      newSend.addEventListener('click', () => {
        const inp = document.getElementById('chat-input');
        if (inp && inp.value.trim()) {
          inp.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        }
      });
    }

    // V8 fix P0-2/3 — RE-WIRE 4 listeners attachés AVANT par sprints/extensions/V5,
    // qui ont été tués par le clone de #chat-input ci-dessus :
    //   - honor : maybeProposeHonoring (auto-suggest honor sur "rêve")
    //   - crisis : detectCrisis (13 patterns du sprint, > 4 du bridge)
    //   - body : body keywords → suggest oracle du corps
    //   - lucid : lucid markers auto-detect
    // Contrat : window.__dreamRewireListeners = { honor, crisis, body, lucid }
    // Chaque fonction prend l'input element en argument et attache son listener.
    // Backward-compat : on tente aussi les anciens window.__rewireXxx individuels.
    setTimeout(() => {
      const freshInput = document.getElementById('chat-input');
      const reg = window.__dreamRewireListeners || {};
      let rewiredCount = 0;
      Object.entries(reg).forEach(([name, fn]) => {
        if (typeof fn !== 'function') return;
        try { fn(freshInput); rewiredCount++; }
        catch (e) { console.warn('[bridge] rewire ' + name + ':', e); }
      });
      // Fallback backward-compat (au cas où l'aggregator n'aurait pas été peuplé)
      if (rewiredCount === 0) {
        try { window.__rewireHonor && window.__rewireHonor(freshInput); } catch (e) { console.warn('[bridge] rewireHonor:', e); }
        try { window.__rewireCrisis && window.__rewireCrisis(freshInput); } catch (e) { console.warn('[bridge] rewireCrisis:', e); }
        try { window.__rewireBodyKeywords && window.__rewireBodyKeywords(freshInput); } catch (e) { console.warn('[bridge] rewireBodyKeywords:', e); }
        try { window.__rewireLucidAutoDetect && window.__rewireLucidAutoDetect(freshInput); } catch (e) { console.warn('[bridge] rewireLucidAutoDetect:', e); }
      }
      console.info('[DreamBridge] re-wired chat-input listeners post-clone (' + rewiredCount + '/' + Object.keys(reg).length + ' from aggregator):', Object.keys(reg).join(','));
    }, 100);

    // VOICE — clone orbe and rebind everything
    // V8's pointer logic is complex (long-press 350ms + swipe-up lock). We replicate
    // the essentials here: long-press → start recording, release → stop + transcribe.
    const oldOrbe = document.getElementById('orbe');
    if (oldOrbe) {
      const newOrbe = oldOrbe.cloneNode(true);
      oldOrbe.parentNode.replaceChild(newOrbe, oldOrbe);

      let mediaRecorder = null;
      let recordingStream = null;
      let recordedChunks = [];
      let longPressTimer = null;
      let isRecording = false;
      let pointerStartY = null;
      let isLocked = false;
      const LONG_PRESS_MS = 350;
      const LOCK_THRESHOLD = 60;

      async function realStartRecording() {
        try {
          if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            addRealAnimaMessage('le micro n\'est pas disponible sur ce navigateur.');
            return;
          }
          recordingStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          mediaRecorder = new MediaRecorder(recordingStream);
          recordedChunks = [];
          mediaRecorder.ondataavailable = e => { if (e.data.size > 0) recordedChunks.push(e.data); };
          mediaRecorder.onstop = async () => {
            if (recordingStream) recordingStream.getTracks().forEach(t => t.stop());
            const blob = new Blob(recordedChunks, { type: 'audio/webm' });
            if (blob.size < 1000) {
              addRealAnimaMessage('le souffle a été trop court — on n\'a rien entendu.');
              return;
            }
            addRealUserMessage('[ voix… transcription ]');
            const result = await DreamAPI.transcribeVoice(blob);
            if (result.error || !result.text) {
              const cz = document.getElementById('chat-zone');
              if (cz) {
                const last = cz.querySelector('.from-user:last-of-type');
                if (last) last.remove();
              }
              addRealAnimaMessage('la voix s\'est dissipée. réessaye quand tu veux.');
              return;
            }
            const text = result.text.trim();
            // Replace placeholder with transcription
            const cz = document.getElementById('chat-zone');
            if (cz) {
              const userMsgs = cz.querySelectorAll('.from-user');
              const last = userMsgs[userMsgs.length - 1];
              if (last && last.textContent.includes('transcription')) {
                last.textContent = text;
              }
            }
            // Also save as kairos
            DreamAPI.createKairos({ raw_text: text, kairos_type: 'reve', capture_method: 'voice' });
            // Trigger Anima
            streamAnimaResponse(text);
          };
          mediaRecorder.start();
          isRecording = true;
          newOrbe.classList.add('recording');
          document.body.classList.add('recording-mode');
          const hint = document.getElementById('orbe-hint');
          if (hint) hint.innerHTML = '… j\'écoute. <em>relâche pour clore  ·  glisse ↑ pour verrouiller</em>';
        } catch (e) {
          console.warn('[Voice] start error:', e);
          addRealAnimaMessage('le micro est silencieux — autorise l\'enregistrement dans ton navigateur.');
        }
      }

      function realStopRecording() {
        isRecording = false;
        isLocked = false;
        newOrbe.classList.remove('recording');
        newOrbe.classList.remove('locked');
        document.body.classList.remove('recording-mode');
        const hint = document.getElementById('orbe-hint');
        if (hint) {
          hint.innerHTML = 'tap court  ·  menu<br><span class="swipe-hint">tap long  ·  voix    ·    glisse ↑  ·  lock    ·    swipe bas  ·  constellation</span>';
        }
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
          try { mediaRecorder.stop(); } catch (e) {}
        }
      }

      function onDown(e) {
        if (isLocked) {
          isLocked = false;
          newOrbe.classList.remove('locked');
          realStopRecording();
          return;
        }
        pointerStartY = e.touches ? e.touches[0].clientY : e.clientY;
        longPressTimer = setTimeout(() => { realStartRecording(); }, LONG_PRESS_MS);
      }
      function onMove(e) {
        if (!isRecording || isLocked || pointerStartY === null) return;
        const currY = e.touches ? e.touches[0].clientY : e.clientY;
        const dy = pointerStartY - currY;
        if (dy >= LOCK_THRESHOLD) {
          isLocked = true;
          newOrbe.classList.add('locked');
          // V8 fix P2-4 — montrer le lock-hint-toast (V5 le faisait via showLockHint, bridge l'oubliait)
          const toast = document.getElementById('lock-hint-toast');
          if (toast) {
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 2800);
          }
          // V8 fix P2-5 — mettre à jour orbe-hint pour refléter l'état locked
          const hint = document.getElementById('orbe-hint');
          if (hint) hint.innerHTML = '⌃ verrouillé · parle librement · <em>re-tap pour clore</em>';
        }
      }
      function onUp() {
        if (longPressTimer) { clearTimeout(longPressTimer); longPressTimer = null; }
        pointerStartY = null;
        if (isLocked) return; // keep recording locked
        if (isRecording) {
          realStopRecording();
        } else {
          // Short tap → open radial menu
          const radial = document.getElementById('radial-overlay');
          if (radial) radial.classList.add('active');
          if (window.triggerHaptic) try { window.triggerHaptic('reveal'); } catch (e) {}
        }
      }
      function onCancel() {
        if (longPressTimer) { clearTimeout(longPressTimer); longPressTimer = null; }
        if (!isLocked && isRecording) realStopRecording();
        pointerStartY = null;
      }

      newOrbe.addEventListener('mousedown', onDown);
      newOrbe.addEventListener('mousemove', onMove);
      newOrbe.addEventListener('mouseup', onUp);
      newOrbe.addEventListener('mouseleave', onCancel);
      newOrbe.addEventListener('touchstart', e => { e.preventDefault(); onDown(e); }, { passive: false });
      newOrbe.addEventListener('touchmove', e => { onMove(e); }, { passive: true });
      newOrbe.addEventListener('touchend', e => { e.preventDefault(); onUp(); });
      newOrbe.addEventListener('touchcancel', onCancel);
    }

    // RADIAL — clone all radial-action buttons and intercept BEFORE V8's handler
    // (V8 binds via addEventListener with lexical scope to enterCapter etc., so re-assigning
    //  window.enterCapter doesn't help. We replace the buttons entirely.)
    document.querySelectorAll('.radial-action').forEach(b => {
      const newB = b.cloneNode(true);
      b.parentNode.replaceChild(newB, b);
      newB.addEventListener('click', async () => {
        const action = newB.dataset.action;
        const radial = document.getElementById('radial-overlay');
        if (radial) radial.classList.remove('active');

        switch (action) {
          case 'capter': {
            const inp = document.getElementById('chat-input');
            if (inp) inp.focus();
            window._dreamCapterArmed = true;
            setTimeout(() => { window._dreamCapterArmed = false; }, 12000);
            // V8 fix P0-11 — note système (pas vraie réponse Anima : c'est un feedback d'état UI)
            if (typeof window.__dreamAddSystemNote === 'function') {
              window.__dreamAddSystemNote('capter armé · dépose ce qui vient — un mot suffit.');
            } else {
              addRealAnimaMessage('je t\'écoute. dépose ce qui vient — un mot suffit.');
            }
            break;
          }
          case 'foret': {
            addRealAnimaMessage('la forêt s\'approche… plusieurs voix qui se penchent.');
            try {
              const result = await DreamAPI.summonKairosWisdom({ category: 'libre' });
              if (result.polyphony_text) {
                addRealAnimaMessage(result.polyphony_text);
              } else if (result.rate_limited) {
                addRealAnimaMessage(result.error || 'la forêt te demande de revenir demain.');
              } else if (result.error) {
                addRealAnimaMessage('la forêt attend que tu tiennes d\'abord quelque chose — dépose un kairos d\'abord.');
              } else {
                addRealAnimaMessage('la forêt s\'est tue cette fois.');
              }
            } catch (e) {
              addRealAnimaMessage('les voix se sont retirées dans le brouillard.');
            }
            break;
          }
          case 'portrait': {
            const ppage = document.getElementById('portrait-page');
            if (ppage) {
              document.body.classList.add('modal-open');
              ppage.classList.add('active');
            }
            setTimeout(async () => {
              const body = document.getElementById('portrait-letter-body');
              if (!body) return;
              const orig = body.innerHTML;
              body.innerHTML = '<p style="opacity:0.6;font-style:italic;">la lettre se compose…</p>';
              try {
                const result = await DreamAPI.getPortrait('crossed', 'lune');
                if (result.lettre) {
                  body.innerHTML = result.lettre.split(/\n\n+/).map(p => `<p>${escapeHtml(p)}</p>`).join('');
                } else {
                  body.innerHTML = orig + `<p style="opacity:0.5;font-style:italic;font-size:12px;margin-top:18px;">— pas encore assez de matière déposée pour tisser une lettre vivante.</p>`;
                }
              } catch (e) { body.innerHTML = orig; }
            }, 700);
            break;
          }
          case 'oracle-corps': {
            // V8 fix P0-4 : prioriser openOracleCorpsApp du sprint qui contient paintHeatmap().
            // Avant : bridge faisait juste classList.add → zones du corps restaient neutres.
            if (window.__sprint && typeof window.__sprint.openOracleCorpsApp === 'function') {
              try { window.__sprint.openOracleCorpsApp(); } catch (e) {}
            } else {
              // Fallback : classList.add + appel direct paintHeatmap si exposé
              const ocpage = document.getElementById('oracle-corps-page');
              if (ocpage) {
                document.body.classList.add('modal-open');
                ocpage.classList.add('active');
                if (typeof window.paintHeatmap === 'function') {
                  try { window.paintHeatmap(); } catch (e) {}
                }
              }
            }
            break;
          }
          default: {
            // V8 fix P0-6 : durcir le default-case pour respecter le remap V6.E
            // (journal → cercles, protocoles → constellation, lucid → anima-mundi).
            // Sinon, si V6.E patch est désactivé, label/action désync et on ouvrirait
            // le mauvais écran.
            const REMAP = { journal: 'cercles', protocoles: 'constellation', lucid: 'anima-mundi' };
            const realAction = REMAP[action] || action;
            // Other actions: try V8's handler if present
            if (typeof window.handleRadialAction === 'function') {
              setTimeout(() => { try { window.handleRadialAction(realAction); } catch (e) {} }, 200);
            }
          }
        }
      });
    });

    // Hook portrait toggles → fetch new toggle
    setTimeout(() => {
      document.querySelectorAll('.portrait-toggle').forEach(t => {
        t.addEventListener('click', async () => {
          const side = t.dataset.side;
          const toggleMap = { jour: 'day', nuit: 'night', croise: 'crossed' };
          const apiToggle = toggleMap[side] || 'crossed';
          const body = document.getElementById('portrait-letter-body');
          if (!body) return;
          body.style.opacity = '0.5';
          try {
            const result = await DreamAPI.getPortrait(apiToggle, 'lune');
            if (result.lettre) {
              const paragraphs = result.lettre.split(/\n\n+/).map(p => `<p>${escapeHtml(p)}</p>`).join('');
              body.innerHTML = paragraphs;
            }
          } catch (e) {}
          body.style.opacity = '1';
        });
      });
    }, 1500);

    // Hook bcm-save → real body marker create + reading
    setTimeout(() => {
      const saveBtn = document.getElementById('bcm-save');
      if (saveBtn && !saveBtn._dreamBound) {
        saveBtn._dreamBound = true;
        saveBtn.addEventListener('click', async () => {
          const zone = window._bcmCurrentZone || 'other';
          const sensation = (document.getElementById('bcm-sensation') || {}).value || '';
          const context = (document.getElementById('bcm-context') || {}).value || '';
          const trigger = (document.getElementById('bcm-trigger') || {}).value || '';
          const zoneCustom = (document.getElementById('bcm-zone-name') || {}).value || '';
          // Map V8 zone names to API allowed zones
          const ZONE_MAP = {
            'tete': 'head', 'gorge': 'throat', 'epaules': 'shoulders',
            'poitrine': 'chest', 'coeur': 'heart', 'ventre': 'belly',
            'bas-ventre': 'lower_belly', 'bassin': 'pelvis',
            'dos-haut': 'back_upper', 'dos-bas': 'back_lower',
            'mains': 'hands', 'jambes': 'legs', 'pieds': 'feet',
            'cou': 'neck', 'machoire': 'jaw', 'corps-entier': 'whole_body',
            'autre': 'other'
          };
          const apiZone = ZONE_MAP[zone] || 'other';
          DreamAPI.createBodyMarker({
            zone: apiZone,
            view_face: 'front',
            side: 'center',
            intensity: 3,
            sensation_text: sensation,
            context_text: context,
            trigger_text: trigger,
            zone_custom_text: zoneCustom || null,
          }).catch(e => console.warn('[OracleCorps] save:', e));
        });
      }
    }, 2000);

    // Hook bcm-anima-listen → real polyphonic reading
    setTimeout(() => {
      const listenBtn = document.getElementById('bcm-anima-listen');
      if (listenBtn && !listenBtn._dreamBound) {
        listenBtn._dreamBound = true;
        listenBtn.addEventListener('click', async () => {
          const zone = window._bcmCurrentZone || 'other';
          const sensation = (document.getElementById('bcm-sensation') || {}).value || '';
          const ZONE_MAP_R = {
            'tete': 'head', 'gorge': 'throat', 'epaules': 'shoulders',
            'poitrine': 'chest', 'coeur': 'heart', 'ventre': 'belly',
            'bas-ventre': 'lower_belly', 'bassin': 'pelvis',
            'dos-haut': 'back_upper', 'dos-bas': 'back_lower',
            'mains': 'hands', 'jambes': 'legs', 'pieds': 'feet',
            'cou': 'neck', 'machoire': 'jaw', 'corps-entier': 'whole_body',
            'autre': 'other'
          };
          const apiZone = ZONE_MAP_R[zone] || 'other';
          // give the modal time to open via V8 path
          setTimeout(async () => {
            const container = document.getElementById('srm-voix-container');
            if (!container) return;
            container.innerHTML = '<div style="opacity:0.6;font-style:italic;text-align:center;padding:40px;">les voix s\'approchent…</div>';
            try {
              const result = await DreamAPI.readBodyZone({
                zone: apiZone,
                sensation_text: sensation,
                view_face: 'front'
              });
              if (result.paper && result.stone && result.silk) {
                container.innerHTML = `
                  <div class="srm-voix matter-paper">
                    <div class="srm-voix-titre">paper</div>
                    <div class="srm-citation">${escapeHtml(result.paper.text)}</div>
                  </div>
                  <div class="srm-voix matter-stone">
                    <div class="srm-voix-titre">stone</div>
                    <div class="srm-citation">${escapeHtml(result.stone.text)}</div>
                  </div>
                  <div class="srm-voix matter-silk">
                    <div class="srm-voix-titre">silk</div>
                    <div class="srm-citation">${escapeHtml(result.silk.text)}</div>
                  </div>
                `;
              } else if (result.error) {
                container.innerHTML = `<div style="opacity:0.7;font-style:italic;text-align:center;padding:30px;">les voix se sont retirées — ${escapeHtml(result.error.slice(0, 100))}</div>`;
              }
            } catch (e) {
              container.innerHTML = '<div style="opacity:0.7;font-style:italic;text-align:center;padding:30px;">silence du réseau.</div>';
            }
          }, 700);
        });
      }
    }, 2000);

    // Crisis check on chat input
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
      chatInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          const t = (e.target.value || '').trim();
          if (window.checkCrisisLocal(t)) {
            // Crisis detected — V8's flow will continue, but our overridden simulateAnimaResponse will short-circuit to crisis response.
            console.log('[Crisis] local pattern matched — sanctuaire flow');
          }
        }
      });
    }
  }

  function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[c]);
  }

  /* ─── ONBOARDING FIRST RUN ─── */
  function maybeShowOnboarding() {
    if (localStorage.getItem('dream_onboarded')) return;
    setTimeout(() => {
      // V8 has its own onboarding flow; we just trigger it if present
      if (window.showOnboard && typeof window.showOnboard === 'function') {
        try { window.showOnboard(); } catch (e) {}
      } else if (typeof window.openOnboarding === 'function') {
        try { window.openOnboarding(); } catch (e) {}
      }
      localStorage.setItem('dream_onboarded', '1');
    }, 800);
  }

  /* ─── INIT ORDER ─── */
  async function bootstrap() {
    console.log('[DreamBridge] booting…');
    const client = await initAuth();
    if (!client) {
      console.error('[DreamBridge] auth init failed — degraded mode');
      return;
    }
    if (!DreamAPI._accessToken) {
      // Not signed in → show auth screen
      injectAuthScreen();
      return;
    }
    removeAuthScreen();
    // Wait a tick for V8 main script to define its globals
    setTimeout(() => {
      try { wireAppHooks(); } catch (e) { console.error('[DreamBridge] wireAppHooks failed:', e); }
      maybeShowOnboarding();
      console.log('[DreamBridge] ready. user:', DreamAPI._userId, 'mode:', window.currentAtmosphericMode);
    }, 500);
  }

  // Start when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
})();
