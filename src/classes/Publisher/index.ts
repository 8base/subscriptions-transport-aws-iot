import { IPublisherClient } from '../../interfaces';
import * as aws from "aws-sdk";
import { Config } from '../../config';

export class Publisher implements IPublisherClient {

    async publish(topic: string, payload: Buffer): Promise<void> {
        const iotData = new aws.IotData({ endpoint: Config.iotEndpoint });
        await iotData.publish({
            topic,
            payload
        }).promise();
    }

}