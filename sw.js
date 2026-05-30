const CACHE = 'ai-gold-v1';
const ASSETS = [
  '/AI_Gold_Toolkit/daily-alerts-agent.html',
  '/AI_Gold_Toolkit/linkedin-review-agent.html',
  '/AI_Gold_Toolkit/index.html',
  '/AI_Gold_Toolkit/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
