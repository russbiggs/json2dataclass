interface Events {
    [key: string]: Array<Function>;
}

class PubSub {
    events: Events;

    constructor() {
        this.events = {};
    }
    subscribe = (event: string, callback: Function) => {
        if (!this.events.hasOwnProperty(event)) {
            this.events[event] = [];
        }
        return this.events[event].push(callback);
    };

    publish = (event: string, data: Object = {}) => {
        if (!this.events.hasOwnProperty(event)) {
            return [];
        }
        return this.events[event].map(callback => callback(data));
    };
}

export default PubSub;
