import { ISubscribeHandler, IMqttClient } from '../../../interfaces';
import { Operation } from 'apollo-link';
import { SubscribeInfo } from '../../../types';
import * as path from "path";
import { PredefineTopics } from '../../Topic';



export class OnSubscribeIotTopic implements ISubscribeHandler {

    private client: IMqttClient;

    constructor(client: IMqttClient) {
        this.client = client;
    }

    async subscribe(info: SubscribeInfo, options: any): Promise<void> {
        await this.client.subscribe(info.fullTopic, options);
    }

}