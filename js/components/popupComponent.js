export class PopupComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

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
                border-radius: 10px;
                width: 300px;
            }

            button {
                margin: 5px;
            }
        `;

        this.shadowRoot.append(style);

        //오버레이 제작
        const overlay = document.createElement('div');
        overlay.className = 'popup-overlay';

        const popup = document.createElement('div');
        popup.className = 'popup';

        const title = document.createElement('h2');
        const content = document.createElement('p');

        overlay.appendChild(popup);
        popup.append(title, content);
        this.shadowRoot.appendChild(overlay);
    }

    connectedCallback() {
        this.render();
    }

    static get observedAttributes() {
        return ['title', 'content', 'button-config'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.render();
    }

    render() {
        const overlay = this.shadowRoot.querySelector('.popup-overlay');
        const title = this.shadowRoot.querySelector('h2');
        const content = this.shadowRoot.querySelector('p');
        const popup = this.shadowRoot.querySelector('.popup');

        // Remove old buttons
        popup.querySelectorAll('button').forEach(btn => btn.remove());

        // 제목 및 내용 가져오고 이를 적용
        title.textContent = this.getAttribute('title');
        content.textContent = this.getAttribute('content');

        // 버튼 제목 및 기능을 json형태로 가져오고 이를 popup에 추가
        const buttonsConfig = JSON.parse(this.getAttribute('button-config'));
        buttonsConfig.forEach(btnConfig => {
            const button = document.createElement('button');
            button.textContent = btnConfig.text;
            button.addEventListener('click', () => {
                if (typeof window[btnConfig.action] === 'function') {
                    window[btnConfig.action]();
                }
                this.close();
            });
            popup.appendChild(button);
        });

        overlay.style.display = this.getAttribute('opened') === "true" ? 'flex' : 'none';
    }

    open() {
        this.setAttribute('opened', "true");
    }

    close() {
        this.setAttribute('opened', "false");
    }
}

customElements.define('popup-component', PopupComponent);


/**
html 부분
title : 팝업 이름
content : 팝업 내용
button-config : 팝업 버튼 [{"text":"버튼 제목", "action":"버튼 함수"}, ...]
opened : "true" 팝업 보임, "false" 팝업 안 보임
<popup-component title="Welcome!" content="Choose an option:" button-config='[{"text":"Confirm", "action":"confirmAction"}, {"text":"Cancel", "action":"cancelAction"}]', opened="false"></popup-component>

js 부분
컴퍼넌트 생성
import { PopupComponent } from './components/popupComponent.js';
customElements.get('popup-component') || customElements.define('popup-component', PopupComponent);
const popup = document.querySelector('popup-component');
 
버튼 함수 정의
window.{버튼 함수 이름}} = () => {
    ..함수 내용
};
 */