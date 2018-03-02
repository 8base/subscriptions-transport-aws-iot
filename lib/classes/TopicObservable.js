"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = require("uuid");
class TopicObservable {
    constructor(client, topic, options) {
        // private observers: {[key: string]: IObserver<SubscriptionInfo>};
        this.observers = new Map();
        this.topic = topic;
        this.options = options;
    }
    forEach(fn) {
        throw new Error("Method not implemented.");
    }
    map(fn) {
        throw new Error("Method not implemented.");
    }
    filter(fn) {
        throw new Error("Method not implemented.");
    }
    reduce(fn, initialValue) {
        throw new Error("Method not implemented.");
    }
    flatMap(fn) {
        throw new Error("Method not implemented.");
    }
    from(observable) {
        throw new Error("Method not implemented.");
    }
    of(...args) {
        throw new Error("Method not implemented.");
    }
    subscribe(observerOrNext, error, complete) {
        const id = this.addObserver(this.getObserver(observerOrNext, error, complete));
        return {
            unsubscribe: () => this.unsubscribe(id),
            closed: false
        };
    }
    onData(data) {
        for (const [id, observer] of this.observers) {
            if (observer) {
                observer.next(data);
            }
        }
    }
    onError(err) {
        for (const [id, observer] of this.observers) {
            observer.error(err);
        }
    }
    onComplete() {
        for (const [id, observer] of this.observers) {
            observer.complete();
        }
    }
    /*
        private functions
    */
    addObserver(observer) {
        const id = uuid.v4();
        this.observers.set(id, observer);
        return id;
    }
    unsubscribe(id) {
        this.observers.delete(id);
    }
    getObserver(observerOrNext, error, complete) {
        if (typeof observerOrNext === 'function') {
            return {
                next: (v) => observerOrNext(v),
                error: (e) => error && error(e),
                complete: () => complete && complete(),
            };
        }
        return observerOrNext;
    }
}
exports.TopicObservable = TopicObservable;
//# sourceMappingURL=TopicObservable.js.map