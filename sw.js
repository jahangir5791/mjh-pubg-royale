const CACHE_NAME = 'mjh-pubg-royale-v1';

const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './offline.html',
  './icon-192.png',
  './icon-256.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request).then(networkResponse => {
        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return networkResponse;
      }).catch(() => {
        if (event.request.destination === 'document') {
          return caches.match('./offline.html');
        }
        return new Response('', { status: 503, statusText: 'Offline' });
      });
    })
  );
});

self.addEventListener('sync', event => {
  if (event.tag === 'sync-game-data') {
    // Future sync logic
  }
});

self.addEventListener('push', event => {
  const data = event.data ? event.data.text() : 'New game notification!';
  const options = {
    body: data,
    icon: './icon-192.png',
    badge: './icon-192.png',
    vibrate: [100, 50, 100],
    data: { date: new Date().toISOString() }
  };

  event.waitUntil(
    self.registration.showNotification('MJH PUBG Royale', options)
  );
});
