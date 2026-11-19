// Service worker mínimo: siempre trae la versión nueva de la página (no guarda copias viejas).
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).catch(() => new Response(
      '<!DOCTYPE html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
      '<body style="font-family:system-ui;padding:24px"><h2>Sin conexión</h2><p>Necesitás internet para usar la app. Probá de nuevo en un momento.</p></body>',
      { headers: { 'Content-Type': 'text/html; charset=utf-8' } })));
  }
});
