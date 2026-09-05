/* Service worker — ECG1. Stratégie « réseau d'abord » :
   contenu toujours à jour quand on est en ligne, repli sur le cache hors-ligne. */
const CACHE = "ecg1-v6";

self.addEventListener("install", function () {
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil((async function () {
    const keys = await caches.keys();
    await Promise.all(keys.filter(function (k) { return k !== CACHE; })
                          .map(function (k) { return caches.delete(k); }));
    await self.clients.claim();

    /* Sur iOS/PWA, une ancienne fenêtre peut rester sur l'ancien shell.
       Lorsqu'une nouvelle version du worker s'active, on recharge une fois
       les fenêtres déjà ouvertes pour qu'elles récupèrent les nouveaux assets. */
    const clients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    await Promise.all(clients.map(function (client) {
      return client.navigate(client.url).catch(function () { return null; });
    }));
  })());
});

self.addEventListener("fetch", function (event) {
  const req = event.request;
  if (req.method !== "GET") return;
  if (new URL(req.url).origin !== self.location.origin) return;
  event.respondWith((async function () {
    try {
      /* no-store évite que Safari nous rende une ancienne réponse HTTP
         alors que la stratégie du service worker est censée être réseau d'abord. */
      const fresh = await fetch(req, { cache: "no-store" });
      const cache = await caches.open(CACHE);
      cache.put(req, fresh.clone());
      return fresh;
    } catch (err) {
      const cached = await caches.match(req);
      if (cached) return cached;
      if (req.mode === "navigate") {
        const home = await caches.match("index.html");
        if (home) return home;
      }
      throw err;
    }
  })());
});
