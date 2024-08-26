// Slider handling
var slider = document.getElementById("slider");
var sliderValueDisplay = document.getElementById("sliderValue");
var youtubeVideo = document.getElementById("youtubeVideo")

var youtubeID = ""
var youtubeTime = 0


// Iframe Player API를 비동기적으로 로드
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. API 코드를 다운로드 받은 다음에 <iframe>을 생성하는 기능 (youtube player도 더불어)
var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('youtubeVideo', {
        height: '360',  //변경가능-영상 높이
        width: '640',  //변경가능-영상 너비
        videoId: youtubeID,  //변경-영상ID
        playerVars: {
            'rel': 0,    //연관동영상 표시여부(0:표시안함)
            'controls': 0,    //플레이어 컨트롤러 표시여부(0:표시안함)
            //'autoplay': 1,   //자동재생 여부(1:자동재생 함, mute와 함께 설정)
            'mute': 1,   //음소거여부(1:음소거 함)
            'loop': 1,    //반복재생여부(1:반복재생 함)
            'playsinline': 1,    //iOS환경에서 전체화면으로 재생하지 않게
        },
        events: {
            'onReady': onPlayerReady, //onReady 상태일 때 작동하는 function이름
            'onStateChange': onPlayerStateChange //onStateChange 상태일 때 작동하는 function이름
        }
    });
}

// 4. API는 비디오 플레이어가 준비되면 아래의 function을 불러올 것이다.
function onPlayerReady(event) {
    slider.setAttribute("max", player.getDuration())
    event.target.mute();
    event.target.playVideo();
}

// 5. API는 플레이어의 상태가 변화될 때 아래의 function을 불러올 것이다.
//    이 function은 비디오가 재생되고 있을 때를 가르킨다.(state=1)
var done = false;
function onPlayerStateChange(event) {
    //setTimeout(stopVideo(), 1000);
    // if (event.data == YT.PlayerState.PLAYING && !done) {
    //     setTimeout(stopVideo, 6000);
    //     done = true;
    // }
}
function stopVideo() {
    player.stopVideo();
}

slider.oninput = function () {
    sliderValueDisplay.textContent = this.value;
    youtubeTime = this.value
}

slider.addEventListener('change', function () {
    player.seekTo(youtubeTime,true); 
});

function showPopup() {
    document.getElementById('overlay').style.display = 'flex';
    document.body.classList.add('body-no-scroll'); // 스크롤 비활성화
    setTimeout(() => {
        document.getElementById('popup').style.transform = 'translateY(0)';
    }, 10);
}

function hidePopup() {
    document.getElementById('popup').style.transform = 'translateY(100%)';
    document.body.classList.remove('body-no-scroll'); // 스크롤 활성화
    setTimeout(() => {
        document.getElementById('overlay').style.display = 'none';
    }, 300); // Ensure this matches the duration of the transition
}

document.getElementById('overlay').addEventListener('click', function (event) {
    if (event.target === this) { // Only close if the overlay itself, not its children, is clicked
        hidePopup(); // Reuse the existing function to toggle the popup
    }
});

// Function to handle the shared data
function handleSharedData() {
    const parsedUrl = new URL(window.location);
    const title = parsedUrl.searchParams.get('title');
    const text = parsedUrl.searchParams.get('text');
    const url = parsedUrl.searchParams.get('url');

    const youtubeUrl = new URL(text);
    youtubeID = youtubeUrl.searchParams.get('v');
    youtubeTime = youtubeUrl.searchParams.get('t') || 0;

    if (text) {
        //document.getElementById('content').innerText = `${text}`;
        document.getElementById('title').innerText = `${title}`;
    }
}

function CreateSpaceContent() {
    var contentElement = document.getElementById("content");
    var text = contentElement.innerText;
    var lines = text.split('\n');
    var formattedText = lines.map(function (line) {
        if (line.match(/^\d+\./)) { // Checks if the line starts with number followed by dot
            return '<li class="numbered-line" style="text-indent: -1em; padding-left: 1em; display: block;">' + line + '</li>';
        } else {
            return line; // Non-numbered lines are not wrapped
        }
    }).join('\n');
    contentElement.innerHTML = formattedText;
}

window.addEventListener('DOMContentLoaded', () => {
    CreateSpaceContent();
    handleSharedData();
});

document.getElementById('closeApp').addEventListener('click', function () {
    window.open('https://youtu.be/watch?v=CAtxNQDUzvk', '_blank');
});