const showConfirmationModal = (link) => {
    // Bootstrap 모달 HTML
    const modalHtml = `
      <div class="modal fade" id="clipboardModal" tabindex="-1" aria-labelledby="clipboardModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="clipboardModalLabel">YouTube 링크 분석</h5>
              <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              클립보드에 있는 YouTube 링크로 데이터를 분석하시겠습니까?
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">아니요</button>
              <button type="button" class="btn btn-primary" id="confirmBtn">예</button>
            </div>
          </div>
        </div>
      </div>
    `;
  
    document.body.insertAdjacentHTML('beforeend', modalHtml);
  
    const modal = new bootstrap.Modal(document.getElementById('clipboardModal'), {
      keyboard: false
    });
    modal.show();
  
    document.getElementById('confirmBtn').addEventListener('click', () => {
      window.location.href = `https://example.com/analyze?link=${encodeURIComponent(link)}`;
      modal.hide();
    });
  };
  
  const checkClipboardForYouTubeLink = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
      if (youtubeRegex.test(text)) {
        showConfirmationModal(text);
      }
    } catch (error) {
      console.error("클립보드 접근 권한이 거부되었거나 클립보드를 읽는 데 실패했습니다.", error);
    }
  };
  
  document.addEventListener('DOMContentLoaded', checkClipboardForYouTubeLink);