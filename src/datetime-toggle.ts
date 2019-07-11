import PubSub from './pubsub';

class DatetimeToggle {
    elem: HTMLInputElement;
    pubSub: PubSub;

    constructor(pubSub: PubSub) {
        this.elem = document.getElementById('datetime-toggle') as HTMLInputElement;
        this.pubSub = pubSub;
        this.addEventListeners();
    }

    addEventListeners = () => {
        this.elem.addEventListener('change', this.onChange);
    };

    onChange = () => {
        this.pubSub.publish('toggle-datetime');
    };
}

export default DatetimeToggle;
