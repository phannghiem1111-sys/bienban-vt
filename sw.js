/* Bản cũ ở thư mục gốc: tự gỡ để app Miền Nam (/mn/) và Miền Bắc (/mb/) chạy riêng. */
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.map(function (k) { return caches.delete(k); })); }).then(function () { return self.registration.unregister(); })); });
