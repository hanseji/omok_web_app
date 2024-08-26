
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
}

// Function to handle the shared data
function handleSharedData() {
    const parsedUrl = new URL(window.location);
    const title = parsedUrl.searchParams.get('title');
    const text = parsedUrl.searchParams.get('text');
    const url = parsedUrl.searchParams.get('url');

    if (text) {
        document.getElementById('message').innerText = `Received YouTube link: ${text}`;
    }
}

function askForNPerm() {
    Notification.requestPermission().then(function(result) {
        console.log("User choice", result);
        if (result == "granted") {
            console.log("권한 허용됨");
            //configurePushSub();// Write your custom function that pushes your message
        } else {
            console.log("No notification permission granted!");
        }
    });
}

window.addEventListener('DOMContentLoaded', () => {
    document.body.style.display = 'block'; // 문서가 준비되면 본문 보이기
    //askForNPerm()
    handleSharedData();
});
