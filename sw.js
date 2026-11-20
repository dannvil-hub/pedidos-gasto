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

// ---- Notificaciones push ----
self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = { body: e.data ? e.data.text() : '' }; }
  e.waitUntil((async () => {
    await self.registration.showNotification(d.title || 'Nuevo pedido de gasto', {
      body: d.body || '', icon: 'icon-192.png', badge: 'icon-192.png',
      tag: d.tag || 'pedido', data: { url: d.url || './contador.html' }
    });
    const cs = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    cs.forEach(c => c.postMessage({ tipo: 'pedido-nuevo' }));
  })());
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.url) || './contador.html', self.registration.scope).href;
  e.waitUntil((async () => {
    const cs = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of cs) { if (c.url.startsWith(url) && 'focus' in c) return c.focus(); }
    return self.clients.openWindow(url);
  })());
});
