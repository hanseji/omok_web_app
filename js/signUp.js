var videoID;
var videoTime;
handleSharedData();

function signUpSubmit() {
    nameInput = document.getElementById("nameInput").value;
    telNumber = document.getElementById("telNumber").value;
    isBorderline = document.getElementById("isBorderline").checked;
    ages = document.getElementsByName("region").value;
    region = document.getElementsByName("region").value;

    console.log(telNumber)


    fetch(`https://omok-w.fly.dev/omok_signin/${telNumber}?name=${nameInput}&is_me=${isBorderline}&age=${ages}&region=${region}`)
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            if(data.signin) {
                //회원가입 성공
                set_cookie("ph_number", telNumber, 730);
                location.replace(`/view-results-page.html?text=www.youtube.com/watch?v=${videoID}t=${videoTime}`);
            } else {
                console.log("이건");
                //회원가입 실패
                if(String(data.status) == "already exists") {
                    //회원 정보 이미 있음
                    set_cookie("ph_number", telNumber, 730);
                    location.replace(`/view-results-page.html?text=www.youtube.com/watch?v=${videoID}t=${videoTime}`);
                    //window.open("https://omoknuni.netlify.app/login.js");
                } else if(data.status == "no age or region or name") {
                    //정보 빠짐
                } else {
                    console.log(data.status);//회원 가입 실패
                }
            }
            window.close();
        }) // 홈 화면 뜨게 코드 바꾸기
        .catch(error => console.log("실패"))
        .finally(() => console.log("finally"));
}

//쿠키 저장하는 함수
function set_cookie(name, value, expireDays) {
    var date = new Date();
    date.setTime(date.getTime() + expireDays * 24 * 60 * 60 * 1000);
    document.cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value) + ';expires=' + date.toUTCString() + ';path=/';
}

//쿠키 값 가져오는 함수
function get_cookie(name) {
    var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value? value[2] : null;
}

//쿠키 삭제하는 함수
function delete_cookie(name) {
    document.cookie = encodeURIComponent(name) + '=; expires=Thu, 01 JAN 1999 00:00:10 GMT';
}

// Function to handle the shared data
function handleSharedData() {
    const parsedUrl = new URL(window.location);
    videoID = parsedUrl.searchParams.get('v');
    videoTime = parsedUrl.searchParams.get('t');
}
