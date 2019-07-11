import PubSub from './pubsub';

class JSONInput {
    pubSub: PubSub;
    elem: HTMLInputElement;

    constructor(pubSub: PubSub) {
        this.pubSub = pubSub;
        this.elem = document.querySelector('.js-json-input');
        this.addEventListeners();
    }

    addEventListeners = () => {
        this.elem.addEventListener('input', this.onInput);
    };

    onInput = () => {
        try {
            JSON.parse(this.elem.value);
            this.pubSub.publish('enter-json', this.elem.value);
        } catch (e) {
            this.pubSub.publish('json-error', `<span class="error-message">${e.message}:<br>${this.elem.value}<span>`);
        }
    };
}

export default JSONInput;
