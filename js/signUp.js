import {setCookie, getCookie, deleteCookie} from "./utility";

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
                setCookie("ph_number", telNumber, 730);
                setCookie("user_name", nameInput, 730);
                location.replace(`/index.html`);
            } else {
                console.log("이건");
                //회원가입 실패
                if(String(data.status) == "already exists") {
                    //회원 정보 이미 있음
                    //메시지 뜨게
                    setCookie("ph_number", telNumber, 730);
                    location.replace(`/index.html`);
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