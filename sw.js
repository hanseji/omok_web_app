const CACHE_STATIC_NAME = "static-v1";
const CACHE_DYNAMIC_NAME = "dynamic-v0.5.2";

const immutableRequests = [
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css",
    "https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css"
];

const mutableRequests = [
    /*
    '/',
    '/index.html',
    '/manifest.webmanifest',
    '/images/icon-192.png',
    '/images/icon-512.png',
    '/js/app.js',
    '/view-results-page.html',
    */
    '/images/explain/tutorial-clickMore.webm',
    '/images/explain/tutorial-clickOmok.webm',
    '/images/explain/tutorial-clickShare.webm',
    '/images/explain/tutorial-createResult.webm',
    '/images/explain/tutorial-install.webm',
    '/index.html',
    '/login.html',
    '/signUp.html',
    '/tutorial.html',
];


self.addEventListener("install", function (event) {
    event.waitUntil(
        caches.open(CACHE_STATIC_NAME).then(function (cache) {
            const newImmutableRequests = [];
            return Promise.all(
                immutableRequests.map(function (url) {
                    return caches.match(url).then(function (response) {
                        if (response) {
                            return cache.put(url, response);
                        } else {
                            newImmutableRequests.push(url);
                            return Promise.resolve();
                        }
                    });
                })
            ).then(function () {
                return cache.addAll(newImmutableRequests.concat(mutableRequests));
            });
        })
    );
});

self.addEventListener('active', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (CACHE_STATIC_NAME !== cacheName || CACHE_DYNAMIC_NAME !== cacheName) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});


self.addEventListener("fetch", (event) => {
    const url = new URL(event.request.url);

    if (url.pathname === '/share') {
        // 공유된 데이터 처리
        return Response.redirect('/index.html', 303);
    } else {
        /**
         * @TODO 나중에 다시 캐시 사용할 수 있게 수정
         */
        //return fetch(event.request);
        // Regular requests not related to Web Share Target.
        event.respondWith(
            caches.match(event.request).then((response) => {
                if (response) {
                    return response;
                } else {
                    return fetch(event.request)
                        .then(function (res) {
                            return caches.open(CACHE_DYNAMIC_NAME).then(function (cache) {
                                cache.put(event.url, res.clone());
                                return res;
                            });
                        })
                        .catch(function (err) {
                            return caches.open(CACHE_STATIC_NAME).then(function (cache) {
                                return cache.match("/offline.html");
                            })
                        });
                }
                return response || fetch(event.request);
            })
        );
    }

});