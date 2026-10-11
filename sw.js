/* Service worker de Copones BV: hace que la app instale y abra al toque, aunque no haya señal.
   - index: red primero (siempre la última versión); si no hay señal o la red tarda más de 3,5 s, la copia guardada.
     Solo se guarda la app real (no un link roto ni una foto abierta sola).
   - SDK de Firebase y fuentes: salen de la caché al toque y se refrescan por atrás (sin señal la app arranca igual)
   - fotos e íconos: caché primero y se refrescan en segundo plano
   - el resto de Firebase (datos, login): pasa directo (no se toca) */
const CACHE = "copones-v2";
const SDK = "https://www.gstatic.com/firebasejs/";
const FUENTES = /^https:\/\/fonts\.(googleapis|gstatic)\.com\//;

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

function esLaApp(url, r) { // la página de la app (no un 404, una redirección ni otra cosa del sitio)
  const s = self.registration.scope, u = url.origin + url.pathname;
  return r.ok && r.type === "basic" && (r.headers.get("content-type") || "").includes("text/html") && (u === s || u === s + "index.html");
}

self.addEventListener("fetch", e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET") return;

  if (url.href.startsWith(SDK) || FUENTES.test(url.href)) { // SDK y fuentes: stale-while-revalidate
    const net = fetch(req).then(r => (r.ok || r.type === "opaque") // la hoja de fuentes llega "opaca"
      ? caches.open(CACHE).then(c => c.put(req, r.clone())).then(() => r, () => r) : r);
    e.respondWith(caches.match(req).then(hit => hit || net));
    e.waitUntil(net.catch(() => {}));
    return;
  }
  if (url.origin !== location.origin) return; // datos y login de Firebase: directo

  if (req.mode === "navigate") { // la app en sí: red primero, con paciencia limitada
    let guardar = Promise.resolve();
    const net = fetch(req).then(r => {
      if (esLaApp(url, r)) { const cp = r.clone(); guardar = caches.open(CACHE).then(c => c.put("./", cp)); }
      return r;
    });
    const guardada = () => caches.match("./");
    e.respondWith(
      Promise.race([net, new Promise(ok => setTimeout(ok, 3500))])
        .then(r => r || guardada().then(h => h || net)) // tardó: la copia guardada (si no hay, se sigue esperando la red)
        .catch(() => guardada().then(h => h || Response.error()))
    );
    e.waitUntil(net.then(() => guardar).catch(() => {})); // aunque haya salido la copia, la nueva termina de bajar y queda guardada
    return;
  }

  e.respondWith( // estáticos (fotos, íconos): caché primero, red de respaldo y refresco silencioso
    caches.match(req).then(hit => {
      const net = fetch(req)
        .then(r => { if (r.ok) { const cp = r.clone(); caches.open(CACHE).then(c => c.put(req, cp)); } return r; })
        .catch(() => hit);
      return hit || net;
    })
  );
});
