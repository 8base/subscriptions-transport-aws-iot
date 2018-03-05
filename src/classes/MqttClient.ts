import { IMqttClient } from '../interfaces';
import * as Mqtt from "mqtt";
import { IClientSubscribeOptions } from 'mqtt';

function _wrapper(client: any) {
    const wss = require('./ws');

    return wss(client, this.options);
 }

export class MqttClient implements IMqttClient {

    private onReceive: Function;
    private onClose: Function;

    private client: Mqtt.Client;

    connect(url: string, options: any, onReceive: Function, onClose: Function): void {
        options.url = url;
        if (options.customAuthHeaders) {
            options.websocketOptions.protocol = 'mqttv3.1';
            options.websocketOptions.headers = options.customAuthHeaders;
            this.client = new Mqtt.Client(_wrapper.bind( { options }), options);
        } else {
            this.client = Mqtt.connect(url);
        }

        this.onReceive = onReceive;
        this.onClose = onClose;
    }

    subscribe(topic: string, options: IClientSubscribeOptions): void {
        this.client.subscribe(topic,
        {
            qos: options.qos
        },
        (err, data) => {
            if (err) {
                return console.log('subscribe failure', err);
            }
            console.log(`subscribing to ${topic}`);
            console.log("data: " + JSON.stringify(data, null, 2));
        });

        this.client.on("error", this.onClose);
        this.client.on("message", this.onReceive);
    }

    unsubscribe(topic: string): void {
        this.client.unsubscribe(topic);
    }
}