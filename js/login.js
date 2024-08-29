function loginSubmit() {
    nameInput = document.getElementById("nameInput").value;
    telNumber = document.getElementById("telNumber").value;

    fetch(`https://omok-w.fly.dev/omok_login/${telNumber}?name=${nameInput}`)
        .then((response) => response.json())
        .then((data) => {
            if(data.login) {
                //로그인 성공
                set_cookie("ph_number", telNumber, 730);
                set_cookie("user_name", nameInput, 730);
                window.close(); // 홈 화면 뜨게 
            } else {
                //로그인 실패
                if(data.status == "no name") {
                    //이름이 빠졌음
                } else {
                    console.log(data.status);//로그인 실패
                }
            }})
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