
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

window.addEventListener('DOMContentLoaded', () => {
    handleSharedData();
});
