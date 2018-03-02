"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Mqtt = require("mqtt");
class MqttClient {
    connect(url, onReceive, onClose) {
        this.client = Mqtt.connect(url);
        this.onReceive = onReceive;
        this.onClose = onClose;
    }
    subscribe(topic, options) {
        this.client.subscribe(topic, {
            qos: options.qos
        }, (err, data) => {
            if (err) {
                return console.log('subscribe failure', err);
            }
            console.log(`subscribing to ${topic}`);
            console.log("data: " + JSON.stringify(data, null, 2));
        });
        this.client.on("error", this.onClose);
        this.client.on("message", this.onReceive);
    }
    unsubscribe(topic) {
        this.client.unsubscribe(topic);
    }
}
exports.MqttClient = MqttClient;
//# sourceMappingURL=MqttClient.js.map