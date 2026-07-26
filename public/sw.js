// Dream — Service Worker OFFLINE-FIRST (2026-07-22, Yeshua/Opus)
// ─────────────────────────────────────────────────────────────────────────────
// POURQUOI il existe : l'app tourne dans un wrapper Capacitor qui charge une
// remote-URL. Si le SHELL n'est pas en cache, RIEN ne s'affiche hors-ligne.
// Ce SW precache le shell /mvp + les assets Next statiques pour que l'app
// S'OUVRE en mode avion après une première visite. (Chantier offline-first,
// « ABSOLUMENT » Tim — §0.3 / §10 A3.)
//
// GARDE-FOU HISTORIQUE (écran noir mobile, avril 2026) : l'ancien SW servait un
// « / » cassé depuis le cache. On ne refait PAS cette erreur —
//   • Navigations HTML  = NETWORK-FIRST (en ligne = toujours frais ; le cache
//     n'est servi QUE hors-ligne), avec repli sur le shell /mvp.
//   • Assets /_next/static (hashés, immuables) = cache-first.
//   • /api/*  = JAMAIS touché (réponses par session ; les dépôts POST doivent
//     atteindre le réseau et échouer proprement pour que la file offline les capte).
// Écrit main, aucune dépendance (pas de workbox).
//
// Bump VERSION à chaque changement de stratégie → purge des anciens caches.
const VERSION = 'dream-sw-v1-2026-07-22'
const SHELL_CACHE = VERSION + '-shell'
const STATIC_CACHE = VERSION + '-static'
const APP_SHELL_URL = '/mvp'

// ── install : precache le shell app (best-effort, ne bloque pas si hors-ligne) ──
self.addEventListener('install', function (event) {
  self.skipWaiting()
  event.waitUntil((async function () {
    try {
      const cache = await caches.open(SHELL_CACHE)
      // `cache: reload` = on force un aller réseau, jamais le HTTP cache navigateur.
      await cache.add(new Request(APP_SHELL_URL, { cache: 'reload' }))
    } catch (e) { /* première visite hors-ligne : le shell se cachera au 1er passage online */ }
  })())
})

// ── activate : prend le contrôle + purge les caches d'anciennes versions ──
self.addEventListener('activate', function (event) {
  event.waitUntil((async function () {
    try {
      const keys = await caches.keys()
      await Promise.all(keys.map(function (k) {
        return k.indexOf(VERSION) === 0 ? Promise.resolve() : caches.delete(k)
      }))
    } catch (e) {}
    try { await self.clients.claim() } catch (e) {}
  })())
})

function isStaticAsset(url) {
  return (
    url.pathname.indexOf('/_next/static/') === 0 ||
    url.pathname.indexOf('/icons/') === 0 ||
    url.pathname === '/manifest.json' ||
    /\.(?:js|css|woff2?|ttf|otf|png|jpe?g|webp|gif|svg|ico)$/.test(url.pathname)
  )
}

self.addEventListener('fetch', function (event) {
  const req = event.request
  // Seuls les GET sont cachables. On ne touche JAMAIS aux POST/PUT/PATCH/DELETE :
  // les dépôts (transcribe, kairos, audio) doivent aller au réseau et échouer
  // proprement pour que la file d'attente (offline-queue.ts) les récupère.
  if (req.method !== 'GET') return
  let url
  try { url = new URL(req.url) } catch (e) { return }
  // Même origine seulement (les fonts Google, cross-origin, restent gérées par le
  // navigateur ; hors-ligne elles retombent sur la stack système — app lisible).
  if (url.origin !== self.location.origin) return
  // Les réponses API sont spécifiques à la session → jamais mises en cache.
  if (url.pathname.indexOf('/api/') === 0) return

  if (req.mode === 'navigate') {
    event.respondWith(networkFirstNavigation(req, url))
    return
  }
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(req))
    return
  }
  event.respondWith(networkFallbackCache(req))
})

// Navigations : réseau d'abord (frais en ligne), cache en repli hors-ligne, puis
// shell /mvp pour que l'app OUVRE toujours sur une route applicative.
async function networkFirstNavigation(req, url) {
  const cache = await caches.open(SHELL_CACHE)
  try {
    const res = await fetch(req)
    if (res && res.ok) { try { await cache.put(req, res.clone()) } catch (e) {} }
    return res
  } catch (e) {
    const cached = await cache.match(req)
    if (cached) return cached
    if (url.pathname.indexOf('/mvp') === 0) {
      const shell = await cache.match(APP_SHELL_URL)
      if (shell) return shell
    }
    return new Response(
      '<!doctype html><meta charset="utf-8"><title>Hors-ligne</title>' +
      '<body style="margin:0;background:#160d0a;color:#f2e8d5;font-family:Georgia,serif;' +
      'display:flex;align-items:center;justify-content:center;height:100vh;text-align:center">' +
      '<p style="font-style:italic;opacity:.8">Hors-ligne — rouvre l’app quand le réseau revient.</p></body>',
      { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    )
  }
}

// Assets hashés immuables : cache-first (instantané, zéro réseau une fois en cache).
async function cacheFirst(req) {
  const cache = await caches.open(STATIC_CACHE)
  const cached = await cache.match(req)
  if (cached) return cached
  try {
    const res = await fetch(req)
    if (res && res.ok) { try { await cache.put(req, res.clone()) } catch (e) {} }
    return res
  } catch (e) {
    return cached || Response.error()
  }
}

// Autres GET même-origine : réseau d'abord, cache en filet.
async function networkFallbackCache(req) {
  const cache = await caches.open(STATIC_CACHE)
  try {
    const res = await fetch(req)
    if (res && res.ok) { try { await cache.put(req, res.clone()) } catch (e) {} }
    return res
  } catch (e) {
    const cached = await cache.match(req)
    return cached || Response.error()
  }
}
