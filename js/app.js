let deferredPrompt;
const installPromptOverlay = document.getElementById('overlay');
const installPrompt = document.getElementById('installPrompt');
const installButton = document.getElementById('installButton');
const installButtonInInfo = document.getElementById('installButtonInInfo');
const installMessage = document.getElementById('installMessage');

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Only show the install button for Android devices
    if (!isIos()) {
        installButton.style.display = 'block';
        installButtonInInfo.style.display = 'block';
        installMessage.innerHTML = "빠르고 쉽게 이용하려면 홈 화면에 이 앱을 설치하세요. 아래 버튼을 누르면 앱이 설치됩니다.";
        installPrompt.style.display = 'block';
        installPromptOverlay.style.display = 'block';
    }
});

installButton.addEventListener('click', async () => {
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
        installButtonInInfo.classList.add("disabled")
        console.log('User accepted the A2HS prompt');
    } else {
        console.log('User dismissed the A2HS prompt');
    }
    deferredPrompt = null;
    installButton.style.display = 'none';
    closePrompt()
});

installButtonInInfo.addEventListener('click', async () => {
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
        installButtonInInfo.classList.add("disabled")
        console.log('User accepted the A2HS prompt');
    } else {
        console.log('User dismissed the A2HS prompt');
    }
    deferredPrompt = null;
});

function closePrompt() {
    installPrompt.style.display = 'none';
    installPromptOverlay.style.display = 'none';
}

function isIos() {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent);
}

function isInStandaloneMode() {
    return ('standalone' in window.navigator) && (window.navigator.standalone);
}

window.onload = () => {
    if (isIos() && !isInStandaloneMode()) {
        iosInstallInfo = `
        <div id="iosInstallPrompt">
			<p>아래 순서를 따라해 홈 화면에 앱이 설치하세요.</p>
			<p>1. 부라우저 하단 <strong>공유 버튼</strong> <img src="images/share_ios-512.png" alt="Share Icon" style="height: 18px; width: 18px; margin-bottom: 0.2rem;"> 누르기</p>
			<p>2. <strong>홈 화면에 선택</strong> 누르기</p>
			<p></p>
        </div>`
        installMessage.innerHTML = iosInstallInfo;
        installPrompt.style.display = 'block'; // Show for iOS
        installPromptOverlay.style.display = 'block'; // Show for iOS
    }
};


window.addEventListener('DOMContentLoaded', () => {
    document.body.style.display = 'block'; // 문서가 준비되면 본문 보이기
});
