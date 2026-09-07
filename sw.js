/* Réseau d'abord, avec repli sur les pages déjà consultées.
   Chaque projet GitHub Pages possède son propre cache. */
const SCOPE = new URL(self.registration.scope);
const PREFIX = "ecg1:" + SCOPE.pathname + ":";
const CACHE = PREFIX + "v16";

self.addEventListener("install", function () { self.skipWaiting(); });

self.addEventListener("activate", function (event) {
  event.waitUntil((async function () {
    const keys = await caches.keys();
    await Promise.all(keys.filter(function (key) {
      return key.startsWith(PREFIX) && key !== CACHE;
    }).map(function (key) { return caches.delete(key); }));
    /* Ne pas recharger les fenêtres : elles peuvent contenir du code non exécuté. */
    await self.clients.claim();
  })());
});

function offlinePage() {
  const home = new URL("index.html", SCOPE).href;
  return new Response('<!doctype html><html lang="fr"><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>Page indisponible hors connexion — ECG1</title>' +
    '<body style="font:1rem/1.6 system-ui;max-width:40rem;margin:4rem auto;padding:1rem">' +
    '<h1>Cette page n’est pas disponible hors connexion.</h1>' +
    '<p>Reconnecte-toi pour la consulter une première fois. Les pages déjà ouvertes peuvent être lues depuis cet appareil.</p>' +
    '<p><a href="' + home + '">Revenir à l’accueil</a></p></body></html>',
    { status: 503, headers: { "Content-Type": "text/html; charset=utf-8" } });
}

self.addEventListener("fetch", function (event) {
  const req = event.request;
  const url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== SCOPE.origin || !url.pathname.startsWith(SCOPE.pathname)) return;
  event.respondWith((async function () {
    const cache = await caches.open(CACHE);
    try {
      const fresh = await fetch(req, { cache: "no-store" });
      if (fresh.ok && fresh.status !== 206) {
        event.waitUntil(cache.put(req, fresh.clone()).catch(function () {}));
      } else if (fresh.status >= 500) {
        const cached = await cache.match(req);
        if (cached) return cached;
      }
      return fresh;
    } catch (err) {
      const cached = await cache.match(req);
      if (cached) return cached;
      if (req.mode === "navigate") return offlinePage();
      return Response.error();
    }
  })());
});
