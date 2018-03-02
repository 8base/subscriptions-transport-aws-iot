"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TopicObservable_1 = require("./TopicObservable");
class SubscriptionClient {
    constructor(url, client) {
        this.observables = new Map();
        if (!url) {
            throw new Error("url resolver is required.");
        }
        this.url = url;
        this.client = client;
        this.connect();
    }
    request(topic, options) {
        const observable = new TopicObservable_1.TopicObservable(this.client, topic, options);
        this.observables.set(topic, observable);
        return observable;
    }
    /*
        Private functions
    */
    connect() {
        this.client.connect(this.url, this.onReceive.bind(this), this.onClose.bind(this));
    }
    onReceive(receivedData, data) {
        const parsed = JSON.parse(String(data));
        for (const [topic, observable] of this.observables) {
            // TODO topic filter
            observable.onData(parsed);
        }
    }
    onClose(reason) {
        for (const [topic, observable] of this.observables) {
            observable.onError(reason);
        }
    }
}
exports.SubscriptionClient = SubscriptionClient;
//# sourceMappingURL=SubscriptionClient.js.map