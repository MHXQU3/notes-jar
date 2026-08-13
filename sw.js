/* ============================================================
   Service worker — makes the app work offline once opened once.
   You shouldn't need to edit this file.
   ============================================================ */

const CACHE_NAME = 'for-you-cache-v1';
const CORE_FILES = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './config.js',
  './manifest.json',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const isCore = CORE_FILES.some((f) => url.pathname.endsWith(f.replace('./', '')));

  if (isCore) {
    // cache-first for the app shell — instant load, always available offline
    event.respondWith(
      caches.match(req).then((cached) => cached || fetch(req))
    );
  } else {
    // network-first for everything else (audio, images) — falls back to
    // cache if offline, and saves a copy the first time something plays
    event.respondWith(
      fetch(req)
        .then((res) => {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          return res;
        })
        .catch(() => caches.match(req))
    );
  }
});
