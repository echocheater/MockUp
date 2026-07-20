const CACHE_NAME = 'kamera-gorden-v2';
const ASSETS = [
  '/MockUp/',
  '/MockUp/index.html',
  '/MockUp/manifest.json',
  '/MockUp/logo.svg',
  '/MockUp/gorden1.webp',
  '/MockUp/gorden2.webp',
  '/MockUp/gorden3.webp'
];

// Tahap Instalasi: Menyimpan file ke dalam Cache
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Tahap Aktivasi: Membersihkan cache lama
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Tahap Fetch: Mengambil file dari Cache agar instan
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});
