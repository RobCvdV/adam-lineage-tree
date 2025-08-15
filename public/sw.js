const CACHE_NAME = 'adam-lineage-v1';
const urlsToCache = [
  '/adam-lineage-tree/',
  '/adam-lineage-tree/index.html',
  '/adam-lineage-tree/manifest.json',
  '/adam-lineage-tree/assets/icon-192x192.png',
  '/adam-lineage-tree/assets/icon-512x512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache)),
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
          // Return cached version or fetch from network
          return response || fetch(event.request);
        },
      ),
  );
});
