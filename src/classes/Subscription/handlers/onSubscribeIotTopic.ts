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

    async subscribe(room: string, user: string, info: SubscribeInfo, options: any): Promise<void> {
        await this.client.subscribe(PredefineTopics.publicTopic(room, user, info.topic), options);
    }

}