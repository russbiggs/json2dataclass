import PubSub from './pubsub';

class SnakeCaseToggle {
    elem: HTMLInputElement;
    pubSub: PubSub;

    constructor(pubSub: PubSub) {
        this.elem = document.getElementById('snake-case-toggle') as HTMLInputElement;
        this.pubSub = pubSub;
        this.addEventListeners();
    }

    addEventListeners = () => {
        this.elem.addEventListener('change', this.onChange);
    };

    onChange = () => {
        this.pubSub.publish('toggle-snake-case');
    };
}

export default SnakeCaseToggle;
