export {setCookie, getCookie, deleteCookie, isUserLogin, isInStandaloneMode, isIos}

/**
 * 제목, 내용, 저장 기간을 입력받아 쿠키를 저장
 * @param {String} name 쿠키 제목
 * @param {String} value 쿠키 내용
 * @param {Number} expireDays 저장 기간(일) 
 */
function setCookie(name, value, expireDays) {
    var date = new Date();
    date.setTime(date.getTime() + expireDays * 24 * 60 * 60 * 1000);
    document.cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value) + ';expires=' + date.toUTCString() + ';path=/';
}

/**
 * 쿠키 제목을 입력하면 해당 쿠키의 내용값을 반환
 * @param {String} name 쿠키 제목
 * @returns {String | null} 쿠키 내용 (없으면 null 반환)
 */
function getCookie(name) {
    var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value? value[2] : null;
}

/**
 * 쿠키 제목을 입력하면 해당 쿠키를 삭제
 * @param {String} name 쿠키 제목
 */
//쿠키 삭제하는 함수
function deleteCookie(name) {
    document.cookie = encodeURIComponent(name) + '=; expires=Thu, 01 JAN 1999 00:00:10 GMT';
}

/**
 * 유저가 현재 로그인 상태인지 확인
 * @returns {Boolean} 로그인 상태면 true 아니면 false
 */
function isUserLogin() {
    if (getCookie("ph_number")) {
        return true;
    } else {
        return false;
    }
}

/**
 * 유저 화면이 IOS인지 확인
 * @returns {Boolean} IOS이면 true 아니면 false
 */
function isIos() {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent);
}

/**
 * 유저가 사이트를 설치했는지 확인
 * @returns {Boolean} 설치했으면 true 아니면 false
 */
function isInStandaloneMode() {
    return window.matchMedia('(display-mode: standalone)').matches || (window.navigator.standalone);
}
