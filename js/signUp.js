import {setCookie} from "./utility.js";
import { PopupComponent } from './components/simplePopup.js';


customElements.get('popup-component') || customElements.define('popup-component', PopupComponent);
const alreadySignUp = document.getElementById('alreadySignUp');
const errorPopup = document.getElementById('errorPopup');

const backToPageButton = document.getElementById('backToPageButton');


function signUpSubmit() {
    var nameInput = document.getElementById("nameInput").value;
    var telNumber = document.getElementById("telNumber").value;
    var isBorderline = document.getElementById("isBorderline").checked;
    var ages = document.getElementById("ageSelect").value;
    var region = document.getElementById("regionSelect").value;

    const regex = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9| |]+$/;
  
    if (!regex.test(nameInput)) {
        alert('이름에 특수 문자는 입력할 수 없습니다.');
        return false;
    }

    showLoadingSpinner();

    fetch(`https://omok-w.fly.dev/omok_signin/${telNumber}?name=${nameInput}&is_me=${isBorderline}&age=${ages}&region=${region}`)
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            if(data.signin) {
                console.log("성공");
                //회원가입 성공
                setCookie("ph_number", telNumber, 730);
                setCookie("user_name", nameInput, 730);
                location.replace(`/index.html`);
            } else {
                hideLoadingSpinner();
                //회원가입 실패
                if(String(data.status) == "already exists") {
                    //회원 정보 이미 있음
                    //메시지 뜨게
                    alreadySignUp.open();
                    //setCookie("ph_number", telNumber, 730);
                    //location.replace(`/index.html`);
                    //window.open("https://omoknuni.netlify.app/login.js");
                } else if(data.status == "no age or region or name") {
                    //정보 빠짐
                } else {
                    errorPopup.open();
                    console.log(data.status);//회원 가입 실패
                }
            }
            window.close();
        }) // 홈 화면 뜨게 코드 바꾸기
        .catch(error => {console.log(error); hideLoadingSpinner();})
        .finally(() => console.log("finally"));
}

function showLoadingSpinner() {
    document.getElementById("loadingScreen").style.display = 'flex';
}

function hideLoadingSpinner() {
    document.getElementById("loadingScreen").style.display = 'none';
}

backToPageButton.addEventListener('click', () => {
    window.location.replace("index.html");
});

document.getElementById('submitButton').addEventListener('click', () => {
    signUpSubmit();
})

document.addEventListener('DOMContentLoaded', () => {
    window.goToLogin = () => {
        location.href = 'login.html';
    };
    window.goToSignUp = () => {
        alreadySignUp.close();
    };
    window.closeErrorPopup = () => {
        errorPopup.close();
    }
});