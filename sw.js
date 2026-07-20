const CACHE_NAME = 'kamera-gorden-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './gorden1.webp',
  './gorden2.webp',
  './gorden3.webp'
];

// Tahap Instalasi: Menyimpan file ke dalam Cache
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Tahap Aktivasi: Membersihkan cache lama jika ada pembaruan
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

// Tahap Fetch: Mengambil file dari Cache agar loading instan
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});
