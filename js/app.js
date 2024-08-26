let deferredPrompt;
const installPrompt = document.getElementById('installPrompt');
const installButton = document.getElementById('installButton');
const installMessage = document.getElementById('installMessage');

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Only show the install button for Android devices
    if (!isIos()) {
        installButton.style.display = 'block';
        installMessage.textContent = "Install this app on your home screen for quick and easy access.";
        installPrompt.style.display = 'block';
    }
});

installButton.addEventListener('click', async () => {
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
    } else {
        console.log('User dismissed the A2HS prompt');
    }
    deferredPrompt = null;
    installButton.style.display = 'none';
});

function closePrompt() {
    installPrompt.style.display = 'none';
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
        installMessage.textContent = "Tap the share icon and then 'Add to Home Screen' to install this app.";
        installPrompt.style.display = 'block'; // Show for iOS
    }
};


window.addEventListener('DOMContentLoaded', () => {
    document.body.style.display = 'block'; // 문서가 준비되면 본문 보이기
});
