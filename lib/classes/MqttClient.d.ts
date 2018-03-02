import { IMqttClient } from '../interfaces';
import { IClientSubscribeOptions } from 'mqtt';
export declare class MqttClient implements IMqttClient {
    private onReceive;
    private onClose;
    private client;
    connect(url: string, onReceive: Function, onClose: Function): void;
    subscribe(topic: string, options: IClientSubscribeOptions): void;
    unsubscribe(topic: string): void;
}
