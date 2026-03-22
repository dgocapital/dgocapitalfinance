const CACHE = 'dgocapital-v1';

self.addEventListener('install', function(e) {
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(self.clients.claim());
});

// Handle background sync notification
self.addEventListener('message', function(e) {
  if (e.data && e.data.type === 'SCHEDULE_NOTIF') {
    var time = e.data.time;
    var parts = time.split(':');
    var h = parseInt(parts[0]), m = parseInt(parts[1]);
    var now = new Date();
    var target = new Date();
    target.setHours(h, m, 0, 0);
    if (target <= now) target.setDate(target.getDate() + 1);
    var delay = target - now;

    setTimeout(function() {
      self.registration.showNotification('DGO Capital Finance', {
        body: 'No olvides registrar tus gastos del dia!',
        icon: 'apple-touch-icon.png',
        badge: 'apple-touch-icon.png',
        vibrate: [200, 100, 200],
        tag: 'dgo-daily',
        renotify: true,
        actions: [
          { action: 'open', title: 'Abrir app' },
          { action: 'dismiss', title: 'Cerrar' }
        ]
      });
      // Reschedule for next day
      scheduleDaily(time);
    }, delay);
  }
});

function scheduleDaily(time) {
  var parts = time.split(':');
  var h = parseInt(parts[0]), m = parseInt(parts[1]);
  var now = new Date();
  var target = new Date();
  target.setHours(h, m, 0, 0);
  target.setDate(target.getDate() + 1);
  var delay = target - now;
  setTimeout(function() {
    self.registration.showNotification('DGO Capital Finance', {
      body: 'No olvides registrar tus gastos del dia!',
      icon: 'apple-touch-icon.png',
      badge: 'apple-touch-icon.png',
      vibrate: [200, 100, 200],
      tag: 'dgo-daily',
      renotify: true
    });
    scheduleDaily(time);
  }, delay);
}

// Open app when notification is clicked
self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  if (e.action === 'dismiss') return;
  e.waitUntil(
    self.clients.matchAll({type:'window', includeUncontrolled:true}).then(function(clients) {
      if (clients.length > 0) {
        return clients[0].focus();
      }
      return self.clients.openWindow('./');
    })
  );
});