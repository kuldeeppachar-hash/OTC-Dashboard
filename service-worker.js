// Minimal service worker — enables "Add to Home Screen" installability and caches
// the app shell (HTML/CSS/JS) so the dashboard opens instantly even on a slow connection.
// Live data (Firebase) always goes over the network — this does NOT cache your sales data,
// so you'll never see stale numbers, only a faster-loading shell.
const CACHE_NAME = 'pil-otc-shell-v1';
const SHELL_FILES = ['./dashboard.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES)).catch(()=>{})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  // Never intercept Firebase/API calls — always go live for real data
  if (url.hostname.includes('firebasedatabase.app') || url.hostname.includes('firebaseio.com') || url.hostname.includes('googleapis.com')) {
    return;
  }
  // App shell files: cache-first for instant load, falling back to network
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
