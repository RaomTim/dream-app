import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Capacitor config — Dream App iOS/Android wrap.
 *
 * Stratégie : MODE REMOTE URL.
 * Dream App = Next.js avec routes API serveur + SSR + 26 endpoints + auth Supabase.
 * Static export (`output:'export'`) casserait toutes les API routes.
 * → On wrap la version Vercel live (https://dream.infuse.earth) dans un WebView natif.
 *
 * Avantages :
 *  - Pas de double build (web/native)
 *  - Update instantanée via Vercel deploy (pas de re-submission App Store pour fixes)
 *  - Cookies/auth Supabase fonctionnent normalement
 *  - Edge Functions accessibles
 *
 * Inconvénients :
 *  - Pas de mode offline (sauf service worker)
 *  - Requires HTTPS valide en prod
 *
 * Permissions demandées :
 *  - Microphone (Whisper transcription rituel capture)
 *  - Notifications (rappels J+7/30/365 Big Dream, polyphonie lunaire)
 *  - Storage (cache local optionnel)
 *
 * Identifiants à utiliser pour App Store / Play Store :
 *  - appId : earth.infuse.dream (reverse-DNS infuse.earth)
 *  - appName : Dream
 *  - team Apple : <DUNS 282628520, à compléter dans Apple Developer console>
 *
 * Yeshua, 2026-04-25 (chantier 4 préparation Capacitor wrap).
 */

const config: CapacitorConfig = {
  appId: 'earth.infuse.dream',
  appName: 'Dream',
  // webDir n'est PAS utilisé en mode server.url, mais Capacitor exige une valeur.
  // On pointe vers /public pour éviter erreur build.
  webDir: 'public',
  server: {
    // Mode REMOTE — wrap la version production Vercel
    // 2026-06-11 : switch V8 (gelé) → MVP. URL = route Next.js src/app/mvp/page.tsx.
    // 2026-07-11 : FIX — virgule perdue dans un commentaire cassait la compilation TS
    //   (confirmé via `tsc` : "',' expected" ligne 45 — npx cap sync aurait échoué).
    // Une fois dream.infuse.earth configuré → remplacer host par 'https://dream.infuse.earth/mvp'
    url: 'https://dream-alpha-bice.vercel.app/mvp',
    cleartext: false,
    androidScheme: 'https',
    iosScheme: 'https',
    // Permettre nav externe vers infuse.earth, supabase, vercel, openai (whisper), anthropic
    allowNavigation: [
      '*.infuse.earth',
      '*.supabase.co',
      '*.vercel.app',
      'dream-alpha-bice.vercel.app',
      'api.openai.com',
      'api.anthropic.com',
      'fonts.googleapis.com',
      'fonts.gstatic.com',
    ],
  },
  ios: {
    scheme: 'Dream',
    contentInset: 'automatic',
    backgroundColor: '#08080b', // matter linen night background
    preferredContentMode: 'mobile',
    limitsNavigationsToAppBoundDomains: false,
  },
  android: {
    backgroundColor: '#08080b',
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false, // true pour debug, false en prod
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true, // FIX 2026-05-16 : auto-hide après 2s (sinon bloqué car web app ne déclenche pas hide())
      backgroundColor: '#08080b',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
      // Les assets sont dans /public/splash/* (cf. brief)
    },
    StatusBar: {
      style: 'DARK', // texte clair sur fond sombre
      backgroundColor: '#08080b',
      overlaysWebView: true,
    },
    Keyboard: {
      resize: 'native',
      style: 'DARK',
      resizeOnFullScreen: true,
    },
  },
};

export default config;
