import PubSub from './pubsub';

class ImportToggle {
    elem: HTMLInputElement;
    pubSub: PubSub;

    constructor(pubSub: PubSub) {
        this.elem = document.getElementById('import-toggle') as HTMLInputElement;
        this.pubSub = pubSub;
        this.addEventListeners();
    }

    addEventListeners = () => {
        this.elem.addEventListener('change', this.onChange);
    };

    onChange = () => {
        this.pubSub.publish('toggle-import');
    };
}

export default ImportToggle;
