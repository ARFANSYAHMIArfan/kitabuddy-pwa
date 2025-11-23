
const CACHE_NAME = 'kitabuddy-v2';

// CDNs used in the app that should be cached aggressively
const EXTERNAL_DOMAINS = [
  'cdn.tailwindcss.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'aistudiocdn.com',
  'www.gstatic.com' // Firebase scripts
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. Ignore API calls (Gemini, Firestore interactions that aren't static scripts)
  if (url.pathname.includes('googleapis.com') && !url.hostname.includes('fonts')) {
    return;
  }
  
  // Ignore chrome extensions
  if (url.protocol === 'chrome-extension:') {
      return;
  }

  // 2. Cache Strategy for External CDNs: Cache First, Fallback to Network
  if (EXTERNAL_DOMAINS.some(domain => url.hostname.includes(domain))) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic' && networkResponse.type !== 'cors') {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        }).catch(() => {
           // If offline and not in cache, nothing we can do for external CDNs usually, 
           // but the app shell should have loaded them once.
        });
      })
    );
    return;
  }

  // 3. Cache Strategy for Local App Files: Network First, Fallback to Cache
  // This ensures users get the latest code updates when online, but works offline.
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
