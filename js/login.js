import {setCookie, getCookie, deleteCookie} from "./utility";

function loginSubmit() {
    nameInput = document.getElementById("nameInput").value;
    telNumber = document.getElementById("telNumber").value;

    fetch(`https://omok-w.fly.dev/omok_login/${telNumber}?name=${nameInput}`)
        .then((response) => response.json())
        .then((data) => {
            if(data.login) {
                //로그인 성공
                setCookie("ph_number", telNumber, 730);
                setCookie("user_name", nameInput, 730);
                location.replace(`/index.html`);
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

document.getElementById("submitButton").addEventListener('click', ()=>{
    loginSubmit();
});