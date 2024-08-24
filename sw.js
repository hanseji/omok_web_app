self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('static-cache').then((cache) => {
            return cache.addAll([
                '/',
                '/index.html',
                '/manifest.json',
                '/images/icons/icon-192x192.png',
                '/images/icons/icon-512x512.png'
            ]);
        })
    );
});

// CACHE_NAME이 변경되면 오래된 캐시 삭제
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keyList) =>
            Promise.all(
                keyList.map((key) => {
                    if (CACHE_NAME !== key) return caches.delete(key);
                })
            )
        )
    );
});


self.addEventListener("fetch", (event) => {
    // Regular requests not related to Web Share Target.
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});