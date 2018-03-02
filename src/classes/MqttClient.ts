import { IMqttClient } from '../interfaces';
import * as Mqtt from "mqtt";
import { IClientSubscribeOptions } from 'mqtt';

export class MqttClient implements IMqttClient {

    private onReceive: Function;
    private onClose: Function;

    private client: Mqtt.Client;

    connect(url: string, onReceive: Function, onClose: Function): void {
        this.client = Mqtt.connect(url);
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