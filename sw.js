/* Service worker tối thiểu: giữ khung ứng dụng để mở nhanh; dữ liệu luôn lấy mới từ máy chủ (POST/Apps Script không bao giờ vào cache). */
var CACHE = 'bbvt-v35';
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(['./', 'manifest.webmanifest', 'icons/icon-192.png']); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  // Mạng trước, lỗi mạng mới dùng bản đã lưu: luôn thấy bản mới nhất khi có mạng
  e.respondWith(fetch(r).then(function (res) {
    var cp = res.clone(); caches.open(CACHE).then(function (c) { c.put(r, cp); }); return res;
  }).catch(function () { return caches.match(r).then(function (m) { return m || caches.match('./'); }); }));
});
