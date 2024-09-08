const CACHE_STATIC_NAME = "static-v1";
const CACHE_DYNAMIC_NAME = "dynamic-v1";

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
    'images/explain/tutorial-clickMore.webm',
    'images/explain/tutorial-clickOmok.webm',
    'images/explain/tutorial-clickShare.webm',
    'images/explain/tutorial-createResult.webm',
    'images/explain/tutorial-install.webm',
    "/offline.html",
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
                    if ((CACHE_STATIC_NAME !== cacheName && cacheName.startsWith("static")) || (CACHE_DYNAMIC_NAME !== cacheName && cacheName.startsWith("dynamic"))) {
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
        if (Notification && Notification.permission === "granted") {
            return Response.redirect('/self-closing-page.html', 303);
            //event.respondWith(handleShare(event.request));
        } else {
            return Response.redirect('/index.html', 303);
        }
    } else {
        event.respondWith(
            caches.match(event.request).then((response) => {
                if (response) {
                    return response;
                } else {
                    return fetch(event.request)
                        .then(function (res) {
                            //캐시가 없으면 일단 다이나믹으로 캐시 저장
                            return caches.open(CACHE_DYNAMIC_NAME).then(function (cache) {
                                cache.put(event.request.url, res.clone());
                                return res;
                            });
                        })
                        .catch(function (err) {
                            //네트워크가 끊기면 offline.html 파일 보여줌
                            return caches.open(CACHE_STATIC_NAME).then(function (cache) {
                                return cache.match("/offline.html");
                            })
                        });
                }
            })
        );
    }

});

// 공유된 데이터 처리 함수
function handleShare(request) {
    const params = new URL(request.url).searchParams;
    const title = params.get('title'); // 공유된 제목
    const text = params.get('text'); // 공유된 텍스트
    const sharedUrl = params.get('url'); // 공유된 URL

    // 유튜브 링크인지 확인
    if (text.includes('youtube.com') || text.includes('youtu.be')) {
        // 알림 보내기
        self.registration.showNotification('유튜브 링크 공유됨', {
            body: `유튜브에서 새 비디오 링크가 공유되었습니다: ${text}`,
            icon: '/images/icon-192.png',
            tag: "vibration-sample"
        });
    }

    // 공유 처리 후 사용자를 환영 페이지로 리디렉션
    return Response.redirect('/self-closing-page.html', 303);
    //return Response.redirect('/', 303);
    /*
    return new Response(JSON.stringify({ message: "Content shared successfully!" }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
    */
}