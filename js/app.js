import { setCookie, getCookie, deleteCookie, isUserLogin } from "./utility.js";
import { checkClipboardForYoutubeLink } from './clipboardModule.js';

checkClipboardForYoutubeLink();

let deferredPrompt;
const installPromptOverlay = document.getElementById('overlay');
const installPrompt = document.getElementById('installPrompt');
const installButton = document.getElementById('installButton');
const installButtonInInfo = document.getElementById('installButtonInInfo');
const installMessage = document.getElementById('installMessage');
const signUpButton = document.getElementById('signUpButton');
const loginButton = document.getElementById('loginButton');
const giveFeeback = document.getElementById('giveFeedback');
const logoutButton = document.getElementById('logoutButton');

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Only show the install button for Android devices
    if (!isIos()) {
        installButtonInInfo.style.display = 'block';
        loginButton.style.display = 'none';
        signUpButton.style.display = 'none';

        // installButton.style.display = 'block';
        // installButtonInInfo.style.display = 'block';
        // installMessage.innerHTML = "빠르고 쉽게 이용하려면 홈 화면에 이 앱을 설치하세요. 아래 버튼을 누르면 앱이 설치됩니다.";
        // installPrompt.style.display = 'block';
        // installPromptOverlay.style.display = 'block';
    }
});

signUpButton.addEventListener('click', () => {
    location.href = "signUp.html";
})

loginButton.addEventListener('click', () => {
    location.href = "login.html";
})

logoutButton.addEventListener('click', () => {
    deleteCookie('ph_number');
    location.href = '#';
})

giveFeeback.addEventListener('click', () => {
    window.open("https://open.kakao.com/o/ggowSOLg");
})

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

document.getElementById("closePopup").addEventListener('click', () => {
    installPrompt.style.display = 'none';
    installPromptOverlay.style.display = 'none';
});

function isIos() {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent);
}

function isInStandaloneMode() {
    return ('standalone' in window.navigator) && (window.navigator.standalone);
}

window.onload = () => {
    if (isIos() && !isInStandaloneMode()) {
        const iosInstallInfo = `
        <div id="iosInstallPrompt">
			<p>아래 순서를 따라해 홈 화면에 앱이 설치하세요.</p>
			<p>1. 부라우저 하단 <strong>공유 버튼</strong> <img src="images/share_ios-512.png" alt="Share Icon" style="height: 18px; width: 18px; margin-bottom: 0.2rem;"> 누르기</p>
			<p>2. <strong>홈 화면에 선택</strong> 누르기</p>
			<p></p>
        </div>`
        installMessage.innerHTML = iosInstallInfo;
        installPrompt.style.display = 'block'; // Show for iOS
        installPromptOverlay.style.display = 'block'; // Show for iOS
    } else if (!isIos && !isInStandaloneMode()) {
        //아이폰이 아니고 설치를 하지 않았을 때
    } else if (isIos && isInStandaloneMode()) {
        //아이폰이고 설치를 했을 때
        if (isUserLogin()) {
            logoutButton.style.display = 'block';
        }
    } else {
        //아이폰이 아니고 설치를 했을 때
        if (isUserLogin()) {
            logoutButton.style.display = 'block';
        }
    }
    handleCookies();
};


window.addEventListener('DOMContentLoaded', () => {
    document.body.style.display = 'block'; // 문서가 준비되면 본문 보이기

    //이미 로그인 상태라면 로그인, 회원가입 버튼 가리기
    if (isUserLogin()) {
        signUpButton.style.display = 'none';
        loginButton.style.display = 'none';
    }
});

function handleCookies() {
    var cookieValue = getCookie("ph_number");
    var freeTimeValue = getCookie("free_times");

    if (cookieValue != null) {
        //로그인을 했으면 사용자 정보 보여주기
        //document.getElementById("user").innerText = getCookie("user_name")
    }
}