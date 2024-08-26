let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    // 설치 프롬프트를 보여주기 전에 발생하는 이벤트를 차단
    e.preventDefault();
    deferredPrompt = e;

    // 설치 버튼 보여주기
    const installButton = document.getElementById('installBtn');
    installButton.style.display = 'block';

    installButton.addEventListener('click', (e) => {
        // 버튼 클릭 시 설치 프롬프트 보여주기
        deferredPrompt.prompt();
        // 사용자가 설치를 결정했는지 확인
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the A2HS prompt');
            } else {
                console.log('User dismissed the A2HS prompt');
            }
            deferredPrompt = null;
        });
    });
});


window.addEventListener('DOMContentLoaded', () => {
    document.body.style.display = 'block'; // 문서가 준비되면 본문 보이기
});
