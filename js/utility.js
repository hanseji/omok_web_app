export {setCookie, getCookie, deleteCookie}

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