import { IPublisherClient } from '../../interfaces';
import * as aws from "aws-sdk";
import { Config } from '../../config';
import * as path from "path";

export class Publisher implements IPublisherClient {

    async publish(client: string, topic: string, payload: Buffer): Promise<void> {

        // TODO protect publish topic

        const iotData = new aws.IotData({ endpoint: Config.iotEndpoint });
        await iotData.publish({
            topic: path.join(Config.onPubslishTopicPrefix, client, topic),
            payload
        }).promise();
    }

}