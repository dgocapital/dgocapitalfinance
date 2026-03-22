const CACHE = 'dgocapital-v1';
var scheduledTime = null;
var notifTimer = null;

self.addEventListener('install', function(e) {
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('message', function(e) {
  if (e.data && e.data.type === 'SCHEDULE_NOTIF') {
    scheduledTime = e.data.time;
    if (notifTimer) clearTimeout(notifTimer);
    scheduleNext(scheduledTime);
  }
  if (e.data && e.data.type === 'CANCEL_NOTIF') {
    scheduledTime = null;
    if (notifTimer) clearTimeout(notifTimer);
  }
});

function scheduleNext(time) {
  var parts = time.split(':');
  var h = parseInt(parts[0]), m = parseInt(parts[1]);
  var now = new Date();
  var target = new Date();
  target.setHours(h, m, 0, 0);
  if (target <= now) target.setDate(target.getDate() + 1);
  var delay = target - now;

  notifTimer = setTimeout(function() {
    self.registration.showNotification('DGO Capital Finance', {
      body: 'No olvides registrar tus gastos del dia!',
      icon: 'apple-touch-icon.png',
      badge: 'apple-touch-icon.png',
      vibrate: [200, 100, 200],
      tag: 'dgo-daily',
      renotify: true
    });
    scheduleNext(time);
  }, delay);
}

self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  if (e.action === 'dismiss') return;
  e.waitUntil(
    self.clients.matchAll({type:'window', includeUncontrolled:true}).then(function(clients) {
      if (clients.length > 0) return clients[0].focus();
      return self.clients.openWindow('./');
    })
  );
});

self.addEventListener('push', function(e) {
  e.waitUntil(
    self.registration.showNotification('DGO Capital Finance', {
      body: e.data ? e.data.text() : 'No olvides registrar tus gastos del dia!',
      icon: 'apple-touch-icon.png',
      tag: 'dgo-daily'
    })
  );
});
