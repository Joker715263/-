self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('cipher-v1').then(cache => {
      return cache.addAll([
        'index.html',
        'style.css',
        'script.js',
        'copy.mp3',
        'manifest.json',
        'icon.png'
      ]);
    })
  );
});
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});
