self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('static-cache').then((cache) => {
            return cache.addAll([
                '/',
                '/index.html',
                '/manifest.webmanifest',
                '/images/icon-192.png',
                '/images/icon-512.png',
                'js/app.js',
                '/self-closing-page.html',
            ]);
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
        // Regular requests not related to Web Share Target.
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request);
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