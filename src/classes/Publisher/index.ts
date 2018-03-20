import { IPublisherClient } from '../../interfaces';
import * as aws from "aws-sdk";
import { Config } from '../../config';
import * as path from "path";

export class Publisher implements IPublisherClient {

    async publish(topic: string, payload: any): Promise<void> {

        // TODO protect publish topic

        const iotData = new aws.IotData({ endpoint: Config.iotEndpoint });
        await iotData.publish({
            topic,
            payload: JSON.stringify(payload)
        }).promise();
    }
}