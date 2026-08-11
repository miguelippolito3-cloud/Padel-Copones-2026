/* Service worker de Copones BV: hace que la app instale y abra al toque.
   - index: red primero (siempre la última versión), caché de respaldo si no hay señal
   - fotos e íconos: caché primero y se refrescan en segundo plano
   - Firebase y fuentes: pasan directo (no se tocan) */
const CACHE = "copones-v1";

self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(["./", "./manifest.webmanifest"])).catch(() => {}));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return; // Firebase, fuentes, etc: directo

  if (e.request.mode === "navigate") { // la app en sí: red primero, caché si no hay señal
    e.respondWith(
      fetch(e.request)
        .then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put("./", cp)); return r; })
        .catch(() => caches.match("./"))
    );
    return;
  }

  e.respondWith( // estáticos (fotos, íconos): caché primero, red de respaldo y refresco silencioso
    caches.match(e.request).then(hit => {
      const net = fetch(e.request)
        .then(r => { if (r.ok) { const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); } return r; })
        .catch(() => hit);
      return hit || net;
    })
  );
});
