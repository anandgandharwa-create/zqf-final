const CACHE_NAME = "zqf-v99";  // <-- हर update पर सिर्फ यही बदलना

const urlsToCache = [
  "/zero-quantum-frequency/",
  "/zero-quantum-frequency/index.html",
  "/zero-quantum-frequency/manifest.json",
  "/zero-quantum-frequency/icon-192.png",
  "/zero-quantum-frequency/icon-512.png",

  // 🔥 NEW PAGES
  "/zero-quantum-frequency/maun-chakra.html",
  "/zero-quantum-frequency/antar-darpan.html",
  "/zero-quantum-frequency/gyan-game.html",
  "/zero-quantum-frequency/mind-witness-quiz.html",

  // existing
  "/zero-quantum-frequency/mindos.html",
  "/zero-quantum-frequency/prashn.html",
  "/zero-quantum-frequency/uttar.html",
];

// INSTALL
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting(); // नया SW तुरंत तैयार
});


// ACTIVATE (पुराने cache delete + control ले)
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// FETCH (offline + auto update cache)
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        // नया data cache में भी डाल दो
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      })
      .catch(() => {
        // net fail → cache से दिखाओ
        return caches.match(event.request);
      })
  );
});
