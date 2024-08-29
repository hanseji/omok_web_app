export class PopupComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.shadowRoot.innerHTML = `
            <!-- bootstrap CSS CDN link -->
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" rel="stylesheet"
                integrity="sha384-4bw+/aepP/YC94hEpVNVgiZdgIC5+VKNBQNGCHeKRQN+PtmoHDEXuppvnDJzQIu9" crossorigin="anonymous" />
            <!-- bootstrap JS CDN script -->
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js"
                integrity="sha384-HwwvtgBNo3bZJJLYd8oVXjrBZt8cqVSpeBNS5n7C8IVInixGAoxmnlMuBnhbgrkm"
                crossorigin="anonymous"></script>
        `

        const style = document.createElement('style');
        style.textContent = `
            .popup-overlay {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                align-items: center;
                justify-content: center;
            }

            .popup {
                background: white;
                padding: 20px;
                border-radius: 15px;
                width: 90%;
                max-width: 500px;
                word-break: keep-all;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }

            .buttonArea {
                display: flex;
                flex-direction: row;
                justify-content: space-evenly;
                gap: 20px;
            }

            .header {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
            }

            h2 {
                margin-block-start: 0.5em;
                margin-block-end: 0.5em;
            }

            .btn {
                flex-grow: 1;
                border: 1px solid transparent;
                border-radius: 12px;
                padding-bottom: 18px;
                padding-top: 18px;
                margin-top: 10px;
            }
        `;

        this.shadowRoot.append(style);

        //오버레이 제작
        const overlay = document.createElement('div');
        overlay.className = 'popup-overlay';

        const popup = document.createElement('div');
        popup.className = 'popup';

        const header = document.createElement('div');
        header.className = 'header';
        const title = document.createElement('h2');
        const closeButton = document.createElement('button');
        closeButton.className = 'btn-close';

        const content = document.createElement('p');

        const buttonArea = document.createElement('div');
        buttonArea.className = 'buttonArea';

        overlay.appendChild(popup);
        header.append(title, closeButton);
        popup.append(header, content, buttonArea);
        this.shadowRoot.appendChild(overlay);
    }

    connectedCallback() {
        this.render();
    }

    static get observedAttributes() {
        return ['title', 'content', 'button-config', 'close-button', 'opened'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.render();
    }

    render() {
        const overlay = this.shadowRoot.querySelector('.popup-overlay');
        const title = this.shadowRoot.querySelector('h2');
        const content = this.shadowRoot.querySelector('p');
        const buttonArea = this.shadowRoot.querySelector('.buttonArea');
        const closeButton = this.shadowRoot.querySelector('.btn-close');
        const popup = this.shadowRoot.querySelector('.popup');
        
        const useCloseButton = this.getAttribute('close-button') || "false";

        // 이미 쓴 버튼은 다 버리기
        buttonArea.querySelectorAll('button').forEach(btn => btn.remove());

        // 제목 및 내용 가져오고 이를 적용
        title.textContent = this.getAttribute('title');
        content.textContent = this.getAttribute('content');

        // 버튼 제목 및 기능을 json형태로 가져오고 이를 popup에 추가
        const buttonsConfig = JSON.parse(this.getAttribute('button-config'));
        buttonsConfig.forEach(btnConfig => {
            const button = document.createElement('button');
            button.textContent = btnConfig.text;
            btnConfig.class.forEach(eachClass => {
                button.classList.add(eachClass);
            });
            button.addEventListener('click', () => {
                if (typeof window[btnConfig.action] === 'function') {
                    window[btnConfig.action]();
                }
                //this.close();
            });
            buttonArea.appendChild(button);
        });

        closeButton.addEventListener('click', () => {
            console.log("클릭");
            this.close();
        });

        closeButton.style.display = useCloseButton === "true" ? 'block' : 'none';
        overlay.style.display = this.getAttribute('opened') === "true" ? 'flex' : 'none';
    }

    open() {
        this.setAttribute('opened', "true");
    }

    close() {
        this.setAttribute('opened', "false");
    }
}


/**
html 부분
title : 팝업 이름
content : 팝업 내용
close-button : "true" 팝업 닫기 버튼 보임, "false" 팝업 닫기 버튼 안 보임 (인잣갑이 없으면 false가 기본)
button-config : 팝업 버튼 [{"text":"버튼 제목", "action":"버튼 함수", "class":["추가할 class", ...]}, ...]
opened : "true" 팝업 보임, "false" 팝업 안 보임
<popup-component title="Welcome!" content="Choose an option:" button-config='[{"text":"Confirm", "action":"confirmAction"}, {"text":"Cancel", "action":"cancelAction"}]', opened="false"></popup-component>

js 부분
컴퍼넌트 생성
import { PopupComponent } from './components/popupComponent.js';
customElements.get('popup-component') || customElements.define('popup-component', PopupComponent);
const popup = document.querySelector('popup-component');
 
버튼 함수 정의
window.{버튼 함수 이름} = () => {
    ..함수 내용
};

예시
window.confirmAction = () => {
    popup.close();
};
 */