import { ISubscribeHandler, IMqttClient } from '../../../interfaces';
import { Operation } from 'apollo-link';
import { SubscribeInfo } from '../../../types';

export class IotSubscribeHandler implements ISubscribeHandler {

    private client: IMqttClient;

    constructor(client: IMqttClient) {
        this.client = client;
    }

    async subscribe(info: SubscribeInfo, options: any): Promise<void> {
        await this.client.subscribe(info.topic, options);
    }

}