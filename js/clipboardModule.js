
import { PopupComponent } from './components/simplePopup.js';


customElements.get('popup-component') || customElements.define('popup-component', PopupComponent);
var youtubeLink;

function isIos() {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
}

function isInStandaloneMode() {
  return ('standalone' in window.navigator) && (window.navigator.standalone);
}


export async function checkClipboardForYoutubeLink() {
  try {
    if (isIos && isInStandaloneMode) {
      // 클립보드 내용을 읽기
      const text = await navigator.clipboard.readText();

      // 유튜브 링크인지 확인하는 정규 표현식
      const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;

      if (youtubeRegex.test(text)) {
        // 유튜브 링크가 감지되면 모달 표시
        youtubeLink = text;
        showYoutubeRedirectModal(text);
      }
    }
  } catch (error) {
    console.error('Failed to read clipboard contents:', error);
  }
}

function showYoutubeRedirectModal(youtubeLink) {
  // 모달이 이미 있으면 삭제
  let existingModal = document.getElementById('detectedClipboard');
  if (existingModal) {
    existingModal.remove();
  }

  // 모달 HTML 생성
  const modalHtml = `
	<popup-component id="detectedClipboard" title="유튜브 링크 감지됨" content="클립보드에서 유튜브 링크를 감지했습니다. 이 링크에 대한 요약을 진행할까요?", close-button="true", button-config='[{"text":"취소", "action":"goToHome", "class":["btn-secondary", "btn"]}, {"text":"요약하기", "action":"goToSummary", "class":["btn-primary", "btn"]}]', opened="true"></popup-component>
  `;

  // 모달을 body에 추가
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

// 페이지가 로드될 때 클립보드를 확인하도록 설정
window.addEventListener('DOMContentLoaded', () => {
  checkClipboardForYoutubeLink();
  window.goToHome = () => {
    if (document.getElementById('detectedClipboard')) {
      document.getElementById('detectedClipboard').close();
    }
  };
  window.goToSummary = () => {
    window.location.href = '/view-results-page.html?text=' + encodeURIComponent(youtubeLink);
  };
});