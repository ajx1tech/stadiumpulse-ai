const CACHE_NAME = 'stadiumpulse-v1';
const STATIC_ASSETS = [
  '/',
  '/favicon.ico',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Network-first for API calls (Firebase / Gemini)
  if (url.origin.includes('firebaseio.com') || url.origin.includes('googleapis.com')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return new Response(JSON.stringify({ error: "Offline mode: Real-time data unavailable." }), {
            headers: { 'Content-Type': 'application/json' }
          });
        })
    );
    return;
  }

  // Cache-first for static assets and general navigation
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        // Offline banner fallback for document requests
        if (event.request.destination === 'document') {
          return new Response(
            `<!DOCTYPE html>
             <html lang="en">
               <head>
                 <title>Offline | StadiumPulse AI</title>
                 <style>
                   body { font-family: sans-serif; background-color: #0f172a; color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; }
                   .banner { background-color: #ef4444; padding: 1rem 2rem; border-radius: 0.5rem; font-weight: bold; }
                 </style>
               </head>
               <body>
                 <div class="banner">⚠️ You are currently offline. Please check your connection.</div>
               </body>
             </html>`,
             { headers: { 'Content-Type': 'text/html' } }
          );
        }
      });
    })
  );
});
