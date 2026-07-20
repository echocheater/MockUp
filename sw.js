const CACHE_NAME = 'kamera-gorden-v5'; // Naikkan versi ini jika Anda melakukan perubahan besar

// Daftar aset utama yang WAJIB ada saat pertama kali dibuka
const PRECACHE_ASSETS = [
  '/MockUp/',
  '/MockUp/index.html',
  '/MockUp/manifest.json',
  '/MockUp/logo.svg'
];

// Tahap Instalasi: Hanya mengunci aset inti agar proses instalasi instan dan lancar
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Tahap Aktivasi: Menghapus cache versi lama secara otomatis
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

// Tahap Fetch: STRATEGI NETWORK-FIRST (Ambil data terbaru dari internet, simpan otomatis ke cache)
self.addEventListener('fetch', (e) => {
  // Hanya proses request lokal (bukan ekstensi browser atau analytics luar)
  if (!e.request.url.startsWith(self.location.origin)) return;

  e.respondWith(
    fetch(e.request)
      .then((networkResponse) => {
        // Jika internet tersambung, kloning hasilnya dan simpan/perbarui di dalam cache secara otomatis
        if (networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Jika koneksi internet terputus (offline), ambil cadangan dari cache
        return caches.match(e.request);
      })
  );
});
