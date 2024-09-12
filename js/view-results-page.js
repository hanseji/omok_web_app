import { setCookie, getCookie, deleteCookie, isUserLogin } from "./utility.js";
import { PopupComponent } from './components/simplePopup.js';


customElements.get('popup-component') || customElements.define('popup-component', PopupComponent);
const motivateingSignUpPopup = document.getElementById('motivateingSignUpPopup');

// Slider handling
var slider = document.getElementById("slider");
var sliderCheckButton = document.getElementById("closePopup");
var youtubeVideo = document.getElementById("youtubeVideo");
var openPopupButton = document.getElementById("openPopupButton");

var youtubeID = ""
var youtubeTime = 0

var cookieValue;

//바로 실행되는 함수
function initialYoutube() {
    // Iframe Player API를 비동기적으로 로드
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}
// 3. API 코드를 다운로드 받은 다음에 <iframe>을 생성하는 기능 (youtube player도 더불어)
var player;
window.onYouTubeIframeAPIReady = function() {
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
    // 4. API는 비디오 플레이어가 준비되면 아래의 function을 불러올 것이다.
    function onPlayerReady(event) {
        slider.setAttribute("max", player.getDuration())
        event.target.mute();
        event.target.playVideo();
    }

    // 5. API는 플레이어의 상태가 변화될 때 아래의 function을 불러올 것이다.
    //    이 function은 비디오가 재생되고 있을 때를 가르킨다.(state=1)
    function onPlayerStateChange(event) {
        // setTimeout(stopVideo(), 5000);
        // if (event.data == YT.PlayerState.PLAYING) {
        //     setTimeout(stopVideo, 3000);
        // }
    }
    function stopVideo() {
        player.stopVideo();
    }
}


slider.oninput = function () {
    sliderCheckButton.innerText = `${String(Math.floor(this.value / 60)).padStart(2, "0")}분 ${String(this.value % 60).padStart(2, "0")}초의 설명 보기`;
    youtubeTime = this.value
}

slider.addEventListener('change', function () {
    player.seekTo(youtubeTime, true);
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
    let parsedUrl = new URL(window.location);
    let title = parsedUrl.searchParams.get('title');
    let text = parsedUrl.searchParams.get('text');
    let url = parsedUrl.searchParams.get('url');

    let youtubeUrl = new URL(text);
    youtubeID = youtubeUrl.searchParams.get('v') || youtubeUrl.pathname.slice(1);
    youtubeTime = youtubeUrl.searchParams.get('t') || 0;

    console.log(text + "  " + youtubeID);

    if (text) {
        //document.getElementById('content').innerText = `${text}`;
        initialYoutube();
        document.getElementById('title').innerText = `${title}`;
        //fetchSummaryData();
    }
}

function fetchSummaryData() {
    showLoadingSpinner();
    console.log(youtubeTime);
    var fetchUrl;
    if (!isUserLogin()) {
        fetchUrl = `https://omok-w.fly.dev/youtube_summary/${youtubeID}?t=${youtubeTime}s`;
    } else {
        fetchUrl = `https://omok-w.fly.dev/youtube_summary/${youtubeID}?ph=${cookieValue}&t=${youtubeTime}s`;
    }
    console.log(fetchUrl);
    fetch(fetchUrl)
        .then((response) => response.json())
        .then((data) => CreateSpaceContent(data.summary))
        .catch(error => { CreateSpaceContent('데이터를 가져오는 중 에러가 발생하였습니다\n에러코드 : ', error); hideLoadingSpinner(); })
        .finally(() => hideLoadingSpinner());
}

function showLoadingSpinner() {
    document.getElementById("loadingScreen").style.display = 'flex';
    openPopupButton.classList.add("disabled");
}

function hideLoadingSpinner() {
    document.getElementById("loadingScreen").style.display = 'none';
    openPopupButton.classList.remove("disabled");
}

function CreateSpaceContent(textInput) {
    var contentElement = document.getElementById("content");
    if (textInput == null) { var text = contentElement.innerText; }
    else { var text = textInput }
    var lines = text.split('\n');
    var formattedText = lines.map(function (line) {
        if (line.match(/^\d+\./)) { // Checks if the line starts with number followed by dot
            return '<li class="numbered-line" style="text-indent: -1em; padding-left: 1em; display: block;">' + line + '</li>';
        } else {
            return line; // Non-numbered lines are not wrapped
        }
    }).join('\n');
    formattedText = formattedText + "<br><br>"
    contentElement.innerHTML = formattedText;
}

function handleCookies() {
    cookieValue = getCookie("ph_number");
    var freeTimeValue = getCookie("free_times");

    if (cookieValue == null && freeTimeValue == null) {
        //처음 사용해보는 사람임
        handleSharedData();
        setCookie("free_times", 1, 30);
    } else if (cookieValue == null && Number(freeTimeValue) < 3) {
        //이전에 사용한 적이 있지만 3번 미만으로 사용한 사람임
        //아직 회원가입 의무 없음
        handleSharedData();
        setCookie("free_times", String(Number(freeTimeValue) + 1), 30);
    } else if (cookieValue == null) {
        //회원가입 의무 있음
        motivateingSignUpPopup.open();
    } else if (cookieValue != null) {
        //이미 로그인한 사람으로 회원가입 의무 없음
        handleSharedData();
    }
}

document.getElementById("hidePopup").addEventListener("click", () => {
    hidePopup();
});

document.getElementById("closePopup").addEventListener("click", () => {
    hidePopup();
    fetchSummaryData();
})

openPopupButton.addEventListener('click', () => {
    showPopup();
});

window.addEventListener('DOMContentLoaded', () => {
    //initialYoutube();
    handleCookies(); //쿠키 관리
    CreateSpaceContent(null);
    window.goToHome = () => {
        location.replace("/index.html");
    };
    window.goToSignUp = () => {
        location.replace("/signup");
    };
});

document.getElementById('closeApp').addEventListener('click', function () {
    window.open(`https://youtu.be/watch?v=${youtubeID}`, '_blank');
});