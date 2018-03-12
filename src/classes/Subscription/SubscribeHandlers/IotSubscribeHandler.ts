import { ISubscribeHandler, IMqttClient } from '../../../interfaces';
import { Operation } from 'apollo-link';
import { GqlQueryToTopic } from '../../Utils';

export class IotSubscribeHandler implements ISubscribeHandler {

    private client: IMqttClient;

    constructor(client: IMqttClient) {
        this.client = client;
    }

    async subscribe(operation: Operation, options: any): Promise<void> {
        await this.client.subscribe(GqlQueryToTopic(operation.query), options);
    }

}