// Slider handling
var slider = document.getElementById("slider");
var sliderCheckButton = document.getElementById("closePopup");
var youtubeVideo = document.getElementById("youtubeVideo");
var openPopupButton = document.getElementById("openPopupButton");

var youtubeID = ""
var youtubeTime = 0

//바로 실행되는 함수

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
function onPlayerStateChange(event) {
    // setTimeout(stopVideo(), 5000);
    // if (event.data == YT.PlayerState.PLAYING) {
    //     setTimeout(stopVideo, 3000);
    // }
}
function stopVideo() {
    player.stopVideo();
}

slider.oninput = function () {
    sliderCheckButton.innerText = `${String(Math.floor(this.value/60)).padStart(2, "0")}분 ${String(this.value%60).padStart(2, "0")}초의 설명 보기`;
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
        handleCookies(); //쿠키 관리
        fetchSummaryData();
    }
}

function fetchSummaryData() {
    showLoadingSpinner();
    console.log(youtubeTime);
    console.log(`https://omok-w.fly.dev/youtube_summary/${youtubeID}?t=${youtubeTime}s`);
    fetch(`https://omok-w.fly.dev/youtube_summary/${youtubeID}?t=${youtubeTime}s`)
        .then((response) => response.json())
        .then((data) => CreateSpaceContent(data.summary_result))
        .catch(error => {CreateSpaceContent('데이터를 가져오는 중 에러가 발생하였습니다\n에러코드 : ', error);hideLoadingSpinner();})
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
    if (textInput == null){var text = contentElement.innerText;}
    else{var text = textInput}
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

function handleCookies() {
    cookieValue = getCookie("ph_number");
    freeTimeValue = getCookie("free_times");

    if (cookieValue == null && freeTimeValue == null) {
        //처음 사용해보는 사람임
        setCookie("free_times", 1, 30);
        console.log("1");
    } else if (cookieValue == null && Number(freeTimeValue) < 5) {
        //이전에 사용한 적이 있지만 5번 미만으로 사용한 사람임
        //아직 회원가입 의무 없음
        setCookie("free_times", String(Number(freeTimeValue) + 1), 30);
        console.log("2");
    } else if(cookieValue == null) {
        //회원가입 의무 있음
        console.log("회원가입 해");
        const oldUrl = '/'; // 기본 URL
        const changeUrl = `/signUp.html?v=${youtubeID}?t=${youtubeTime}s`; // 기본 URL로 사이트 접속 시 변경하고 싶은 URL
        location.replace(changeUrl);
    } else if (cookieValue != null) {
        //이미 로그인한 사람으로 회원가입 의무 없음
        console.log("3");
    }
}

window.addEventListener('DOMContentLoaded', () => {
    CreateSpaceContent(null);
    handleSharedData();
});

document.getElementById('closeApp').addEventListener('click', function () {
    window.open(`https://youtu.be/watch?v=${youtubeID}`, '_blank');
});


//쿠키 저장하는 함수
function setCookie(name, value, expireDays) {
    var date = new Date();
    date.setTime(date.getTime() + expireDays * 24 * 60 * 60 * 1000);
    document.cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value) + ';expires=' + date.toUTCString() + ';path=/';
}

//쿠키 값 가져오는 함수
function getCookie(name) {
    var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value? value[2] : null;
}

//쿠키 삭제하는 함수
function deleteCookie(name) {
    document.cookie = encodeURIComponent(name) + '=; expires=Thu, 01 JAN 1999 00:00:10 GMT';
}